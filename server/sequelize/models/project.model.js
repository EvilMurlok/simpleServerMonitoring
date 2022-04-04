const {Model, Op, DataTypes} = require("sequelize");

const {validateProjectData} = require("../utils/project/validateProjectData");
const {validateSameProjectData} = require("../utils/project/validateSameProjectData");

const {
    ProjectCommonError,
    ProjectNotUpdatedDataError,
    ProjectDeletionError,
    ProjectNotFoundError
} = require("../errors/project/projectException");

module.exports = (models) => {
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
                paranoid: false,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                sequelize: sequelize,
            });
        };

        static createProject = async ({userId = 0, projectName = ""}) => {
            const currentUser = models.user.findByPk(userId);
            if (currentUser) {
                try {
                    await validateProjectData({projectName});
                    const bindValidateSameProjectData = validateSameProjectData.bind(this);
                    await bindValidateSameProjectData({userId, projectName});
                } catch (e) {
                    throw e;
                }
                return await this.create({
                    userId: userId,
                    name: projectName
                });
            }

            throw new ProjectCommonError("Cannot create the project", [{
                text: "Невозможно создать проект!"
            }]);
        }

        static editProject = async ({userId = 0, projectId = 0, projectName = ""}) => {
            const currentProject = await this.findOne({
                where: {
                    [Op.and]: [
                        {
                            userId: userId
                        },
                        {
                            id: projectId
                        }
                    ]
                }
            });
            if (currentProject) {
                const projectNameUser = currentProject.name;
                console.log(projectNameUser, projectName);
                if (projectNameUser === projectName) {
                    throw new ProjectNotUpdatedDataError("Data was not changed", [{
                        text: `Данные о проекте ${projectName} изменены не были!`
                    }]);
                } else {
                    try {
                        await validateProjectData({projectName});
                        const bindValidateSameProjectData = validateSameProjectData.bind(this);
                        await bindValidateSameProjectData({userId, projectName, projectNameUser}, true);
                    } catch (e) {
                        throw e;
                    }
                }
                return await this.update({
                    userId: userId,
                    name: projectName
                }, {
                    where: {
                        [Op.and]: [
                            {
                                userId: userId,
                            },
                            {
                                id: projectId
                            }
                        ]
                    }
                });
            }
            throw new ProjectNotFoundError("Such project not found", [{
                text: "Такого проекта у Вас нет!"
            }]);
        }

        static retrieveUserProjects = async ({userId = 0, offset, limit}) => {
            const currentUser = await models.user.findByPk(userId);
            if (currentUser) {
                return await this.findAndCountAll({
                    where: {
                        userId: userId
                    },
                    order: [['created', 'DESC']],
                    offset: offset,
                    limit: limit
                });
            }
            throw new ProjectCommonError("Cannot retrieve user projects", [{
                text: "Невозможно получить список проектов!"
            }]);
        }

        static retrieveAllUserProjects = async ({userId = 0}) => {
            const currentUser = await models.user.findByPk(userId);
            if (currentUser) {
                return await this.findAll({
                    where: {
                        userId: userId
                    },
                    order: [['created', 'DESC']],
                });
            }
            throw new ProjectCommonError("Cannot retrieve user projects", [{
                text: "Невозможно получить список проектов!"
            }]);
        }

        static retrieveProject = async ({projectId, userId}) => {
            const currentProject = await this.findOne({
                where: {
                    [Op.and]: [
                        {
                            id: projectId
                        },
                        {
                            userId: userId
                        }
                    ]
                }
            });
            if (currentProject) {
                return currentProject;
            }
            throw new ProjectNotFoundError("Such project not found", [{
                text: "Такого проекта у вас нет!"
            }]);
        }

        static deleteProject = async ({userId = 0, projectId = 0}) => {
            if (userId && projectId) {
                const currentUser = await models.user.findByPk(userId);
                if (currentUser) {
                    const deletedProjects = await this.destroy({
                        where: {
                            [Op.and]: [
                                {
                                    id: projectId
                                },
                                {
                                    userId: userId
                                }
                            ]
                        }
                    });
                    if (deletedProjects > 0) {
                        return deletedProjects;
                    }
                }
            }
            throw new ProjectDeletionError("Cannot delete the project", [{
                text: "Невозможно удалить проект!"
            }]);
        }
    }

    return Project;
};