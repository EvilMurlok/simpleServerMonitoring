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

        // TODO обновить после добавления кастомных прав, чтобы подтягивались еще и доступные проекты
        static retrieveUserProjectsByName = async ({userId = 0, projectName = "%"}) => {
            const currentUserFoundProjects = await sequelize.models.user.findAll({
                where: {id: userId},
                include: {
                    model: sequelize.models.project,
                    required: true,
                    attributes: ["name"],
                    where: {
                        name: {
                            [Op.iLike]: `%${projectName}%`
                        }
                    }
                }
            });
            if (currentUserFoundProjects.length) {
                return currentUserFoundProjects[0].projects.map(project => project.name);
            } else {
                return [];
            }
        }

        static retrieveUserSortedProjectsWithServers = async ({userId, sortField, sortType, offset, limit}) => {
            const currentUser = await sequelize.models.user.findByPk(userId);
            if (currentUser) {
                return [
                    await this.findAll({
                        include: {
                            model: sequelize.models.server,
                            required: false,
                            include: {
                                model: sequelize.models.tag,
                                required: false,
                            }
                        },
                        where: {userId: userId},
                        order: [[sortField, sortType]],
                        offset: offset,
                        limit: limit
                    }), (await this.findAll({
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

        static retrieveProject = async ({projectId}) => {
            const currentProject = await this.findByPk(projectId);
            if (currentProject) {
                return currentProject;
            }
            throw new ProjectNotFoundError("Such project not found", [{
                text: "Такого проекта у вас нет!"
            }]);
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