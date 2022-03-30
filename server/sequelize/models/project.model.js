const {Model, Op} = require("sequelize");

const {validateProjectData} = require("../utils/project/validateProjectData");
const {validateSameProjectData} = require("../utils/project/validateSameProjectData");

module.exports = class Project extends Model {
    static init(sequelize, DataTypes) {
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
            tableName: 'project',
            paranoid: true,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
            deletedAt: 'deleted',
            sequelize: sequelize,
        });
    };

    static createProject = async ({userId = 0, projectName = ""}, models) => {
        if (userId && projectName) {
            const currentUser = models.user.findByPk(userId);
            if (currentUser) {
                let messages = await validateProjectData({projectName});
                if (messages.length > 0) {
                    return {
                        status: "danger",
                        messages: messages
                    };
                }
                messages = await validateSameProjectData({userId, projectName});
                if (messages.length > 0) {
                    return {
                        status: "danger",
                        messages: messages
                    }
                }
                const createdProject = await this.create({
                    userId: userId,
                    name: projectName
                });
                if (createdProject) {
                    return {
                        status: "success",
                        messages: [{
                            text: `Проект ${projectName} успешно добавлен!`
                        }]
                    };
                }
            }
        }
        return {
            status: "danger",
            messages: [{
                text: "Невозможно добавить проект!"
            },]
        };
    }

    static editProject = async ({userId = 0, projectId = 0, projectName = ""}) => {
        if (userId && projectId && projectName) {
            const currentProject = this.findByPk(projectId)
            if (currentProject) {
                let messages = await validateSameProjectData({userId, projectName});
                if (messages.length > 0) {
                    return {
                        status: "info",
                        messages: [{
                            text: "Информация иземенена не была!"
                        },]
                    };
                }
                const updatedProject = await this.update({
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
                if (updatedProject) {
                    return {
                        status: "success",
                        messages: [{
                            text: "Проект успешно изменен!"
                        }]
                    };
                }
            }
        }
        return {
            status: "danger",
            messages: [{
                text: "Невозможно обновить информацию о проекте!"
            },]
        }
    }

    static retrieveUserProjects = async ({userId = 0}) => {
        if (userId) {
            return await this.findAll({
                where: {
                    userId: userId
                }
            });
        }
    }

    static deleteProject = async ({userId = 0, projectId = 0}) => {
        if (userId && projectId) {
            const deletedServer = await this.destroy({
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
            if (deletedServer) {
                return {
                    status: "success",
                    messages: [{
                        text: "Сервер успешно удален!"
                    },]
                }
            }
        }
        return {
            status: "danger",
            messages: [{
                text: "Не удалось удалить сервер!"
            },]
        };
    }

};