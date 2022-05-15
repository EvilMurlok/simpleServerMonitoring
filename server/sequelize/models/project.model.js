const {Model, Op, DataTypes} = require("sequelize");

const {validateProjectData} = require("../utils/project/validateProjectData");
const {validateSameProjectData} = require("../utils/project/validateSameProjectData");

const {
    ProjectCommonError, ProjectNotUpdatedDataError,
    ProjectDeletionError, ProjectNotFoundError,
    ProjectTransactionError

} = require("../errors/project/projectException");
const {
    PermissionTransactionError,
    PermissionCredentialsError,
    PermissionSameCredentialsError
} = require("../errors/permission/permissionErrors");

module.exports = (sequelize) => {
    class Project extends Model {
        static initModel(sequelize) {
            return super.init({
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    is: /^[a-zA-Z0-9_-]{3,255}$/
                },
            }, {
                modelName: 'project',
                tableName: 'Project',
                paranoid: true,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                deletedAt: 'deleted',
                sequelize: sequelize,
            });
        };

        static createProject = async ({userId = 0, projectName = ""}) => {
            try {
                await validateProjectData({projectName});
                await validateSameProjectData.bind(this)({projectName});
            } catch (e) {
                throw e;
            }
            const currentUser = await sequelize.models.user.findByPk(userId,);
            const t = await sequelize.transaction();
            try {

                const createdProject = await this.create({
                    userId: userId,
                    name: projectName
                }, {transaction: t});
                const createdAdminPermission = await sequelize.models.permission.createAdminPermissionWithProject({project: createdProject}, t);
                await currentUser.addPermission(createdAdminPermission, {transaction: t});
                await t.commit();
                return createdProject;
            } catch (e) {
                await t.rollback();
                if (e instanceof PermissionTransactionError ||
                    e instanceof PermissionCredentialsError ||
                    e instanceof PermissionSameCredentialsError) {
                    throw e;
                } else {
                    throw new ProjectTransactionError("An error occurred during the transaction", [{text: "Не удалось создать проект и добавить Вам право администратора!"}]);
                }
            }

        }

        static editProject = async ({projectId = 0, projectName = ""}) => {
            const currentProject = await this.findByPk(projectId);
            if (currentProject) {
                const projectNameUser = currentProject.name;
                if (projectNameUser === projectName) {
                    throw new ProjectNotUpdatedDataError("Data was not changed", [{
                        text: `Данные о проекте ${projectName} изменены не были!`
                    }]);
                } else {
                    try {
                        await validateProjectData({projectName});
                        await validateSameProjectData.bind(this)({projectName, projectNameUser}, true);
                    } catch (e) {
                        throw e;
                    }
                    const t = await sequelize.transaction();
                    try {
                        const updatedProject = await this.update({
                            name: projectName
                        }, {
                            where: {
                                id: projectId
                            }
                        });
                        await sequelize.models.permission.update({
                            name: `admin${projectName}`
                        }, {
                            where: {
                                name: `admin${projectNameUser}`
                            }
                        });
                        await t.commit();
                        return [updatedProject, {projectName}];
                    } catch (e) {
                        console.error(e);
                        await t.rollback();
                        throw new ProjectTransactionError("An error occurred during the transaction", [{text: "Не удалось изменить проект и право администратора на этот проект!"}]);
                    }
                }

            }
            throw new ProjectNotFoundError("Such project not found", [{
                text: "Такого проекта у Вас нет!"
            }]);
        }

        static retrieveUserProjects = async ({userId = 0, offset, limit}) => {
            const currentUser = await sequelize.models.user.findByPk(userId);
            if (currentUser) {
                return await this.findAndCountAll({
                    where: {userId: userId},
                    order: [['created', 'DESC']],
                    offset: offset,
                    limit: limit
                });
            }
            throw new ProjectCommonError("Cannot retrieve user projects", [{
                text: "Невозможно получить список проектов!"
            }]);
        }

        static retrieveAvailableUserProjects = async ({userId = 0, projectName = "%"}) => {
            const currentUserAvailableProjects = await this.findAll({
                where: {userId: {[Op.ne]: userId}, name: {[Op.iLike]: `%${projectName}%`}},
                attributes: ["id", "name", "created"],
                include: {
                    model: sequelize.models.permission,
                    required: true,
                    attributes: ["id", "name", "projectId"],
                    include: [
                        {
                            model: sequelize.models.ability,
                            required: true,
                            where: {
                                entity: {
                                    [Op.in]: ["Project", "Permission", "Server"]
                                },
                            },
                            attributes: ["id", "entity", "action"],
                            through: {attributes: []}
                        },
                        {
                            model: sequelize.models.user,
                            required: true,
                            where: {id: userId},
                            attributes: [],
                            through: {attributes: []}
                        }
                    ]
                },
                order: [["created", "DESC"]]
            });
            const availableProjectsWithOptions = [];
            for (let currentUserAvailableProject of currentUserAvailableProjects) {
                let [
                    isAbleToCreatePermission,
                    isAbleToUpdateProject,
                    isAbleToDeleteProject,
                    isAbleToCreateServer
                ] = [false, false, false, false];
                if (currentUserAvailableProject.permissions.map(permission => permission.name).includes(`admin${currentUserAvailableProject.name}`)) {
                    availableProjectsWithOptions.push({
                        id: currentUserAvailableProject.id,
                        name: currentUserAvailableProject.name,
                        created: currentUserAvailableProject.created,
                        isAbleToCreatePermission: true,
                        isAbleToUpdateProject: true,
                        isAbleToDeleteProject: true,
                        isAbleToCreateServer: true
                    });
                } else {
                    for (let permissionOfProject of currentUserAvailableProject.permissions) {
                        for (let ability of permissionOfProject.abilities) {
                            if (ability.entity === "Permission" && ability.action === "Create") {
                                isAbleToCreatePermission = true;
                            } else if (ability.entity === "Project" && ability.action === "Update") {
                                isAbleToUpdateProject = true;
                            } else if (ability.entity === "Project" && ability.action === "Delete") {
                                isAbleToDeleteProject = true;
                            } else if (ability.entity === "Server" && ability.action === "Create") {
                                isAbleToCreateServer = true;
                            }
                        }
                    }
                    availableProjectsWithOptions.push({
                        id: currentUserAvailableProject.id,
                        name: currentUserAvailableProject.name,
                        created: currentUserAvailableProject.created,
                        isAbleToCreatePermission: isAbleToCreatePermission,
                        isAbleToUpdateProject: isAbleToUpdateProject,
                        isAbleToDeleteProject: isAbleToDeleteProject,
                        isAbleToCreateServer: isAbleToCreateServer
                    });
                }
            }
            return availableProjectsWithOptions;
        }

        // TODO обновить после добавления кастомных прав, чтобы подтягивались еще и доступные проекты
        static retrieveUserProjectsByName = async ({userId = 0, projectName = "%"}) => {
            const currentUserFoundProjects = await this.findAll({
                where: {
                    userId: userId,
                    name: {
                        [Op.iLike]: `%${projectName}%`
                    }
                },
                attributes: ["name"],
                order: [["name", "ASC"]]
            });

            const currentUserAvailableProjects = await this.findAll({
                where: {userId: {[Op.ne]: userId}, name: {[Op.iLike]: `%${projectName}%`}},
                attributes: ["id", "name"],
                include: {
                    model: sequelize.models.permission,
                    required: true,
                    attributes: ["id", "name"],
                    include: [
                        {
                            model: sequelize.models.ability,
                            required: true,
                            attributes: ["id"],
                            through: {attributes: []}
                        },
                        {
                            model: sequelize.models.user,
                            required: true,
                            where: {id: userId},
                            attributes: ["id"],
                            through: {attributes: []}
                        }
                    ]
                }
            });
            return [...currentUserFoundProjects.map(project => project.name), ...currentUserAvailableProjects.map(project => project.name)];
        }

        static retrieveUserSortedProjectsWithServers = async ({userId, sortField, sortType, offset, limit}) => {
            const currentUser = await sequelize.models.user.findByPk(userId);
            if (currentUser) {
                return [
                    await this.findAll({
                        include: {
                            model: sequelize.models.server,
                            required: false,
                            attributes: ["id", "ip", "hostname", "created"],
                            include: {
                                model: sequelize.models.tag,
                                attributes: ["id", "name", "color"],
                                required: false,
                                through: {attributes: []}
                            }
                        },
                        where: {userId: userId},
                        attributes: ["id", "name", "created"],
                        order: [[sortField, sortType]],
                        offset: offset,
                        limit: limit
                    }), (await this.findAll({
                        attributes: ["id"],
                        where: {userId: userId},
                    })).length
                ];
            }
            throw new ProjectCommonError("Cannot retrieve user projects", [{
                text: "Невозможно получить список проектов!"
            }]);
        }

        static retrieveAllUserProjects = async ({userId = 0}) => {
            const currentUser = await sequelize.models.user.findByPk(userId);
            if (currentUser) {
                return await this.findAll({
                    where: {userId: userId},
                    order: [['created', 'DESC']],
                });
            }
            throw new ProjectCommonError("Cannot retrieve user projects", [{
                text: "Невозможно получить список проектов!"
            }]);
        }

        static retrieveProject = async ({userId = 0, projectId = 0}) => {
            const currentProject = await this.findOne({
                where: {id: projectId},
                attributes: ["id", "name", "created"]
            });
            if (currentProject) {
                let userProjectPermissions = await this.findOne({
                    attributes: ["id"],
                    where: {id: projectId},
                    include: {
                        model: sequelize.models.permission,
                        attributes: ["id"],
                        required: true,
                        include: [
                            {
                                model: sequelize.models.ability,
                                required: true,
                                where: {
                                    entity: "Project",
                                    action: {
                                        [Op.in]: ["Update", "Delete"]
                                    }
                                },
                                attributes: ["entity", "action"],
                                through: {attributes: []}
                            },
                            {
                                model: sequelize.models.user,
                                required: true,
                                where: {id: userId},
                                attributes: [],
                                through: {attributes: []}
                            }
                        ]
                    }
                });
                let [isAbleToUpdate, isAbleToDelete] = [false, false];
                if (userProjectPermissions && userProjectPermissions.permissions && userProjectPermissions.permissions.length > 0) {
                    userProjectPermissions = userProjectPermissions.permissions;
                    for (let userProjectPermission of userProjectPermissions) {
                        for (let ability of userProjectPermission.abilities) {
                            if (ability.action === "Update") {
                                isAbleToUpdate = true;
                            } else if (ability.action === "Delete") {
                                isAbleToDelete = true;
                            }
                        }
                    }
                }
                return [currentProject, isAbleToUpdate, isAbleToDelete];
            }
            throw new ProjectNotFoundError("Such project not found", [{
                text: "Такого проекта у вас нет!"
            }]);
        }

        static retrieveProjectWithServers = async ({projectId = 0}) => {
            const currentProject = await this.findAll({
                where: {id: projectId},
                attributes: ["id", "name"],
                include: {
                    model: sequelize.models.server,
                    required: false,
                    attributes: ["id", "hostname", "ip"],
                    include: {
                        model: sequelize.models.tag,
                        require: false,
                        attributes: ["id", "name", "color"],
                        through: {attributes: []},
                    }
                }
            });
            if (currentProject && currentProject.length) {
                return currentProject[0];
            } else {
                return [];
            }
        }

        static deleteProject = async ({projectId = 0}) => {
            if (projectId) {
                const deletedProjects = await this.destroy({
                    where: {id: projectId}
                });
                if (deletedProjects > 0) {
                    return deletedProjects;
                }
            }
            throw new ProjectDeletionError("Cannot delete the project", [{
                text: "Невозможно удалить проект!"
            }]);
        }
    }

    return Project;
};