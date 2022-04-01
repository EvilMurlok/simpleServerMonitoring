const {Op, Model, DataTypes} = require("sequelize");

const {
    ServerCommonError,
    ServerDeletionError,
    ServerNotUpdatedError,
    ServerNotFoundError
} = require("../errors/server/serverException");
const {validateServerData} = require("../utils/server/validationServerData");
const {validateSameServerData} = require("../utils/server/validationSameServerData");

module.exports = (models) => {
    class Server extends Model {
        static initModel(sequelize) {
            return super.init({
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER
                },
                hostname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    is: /^[a-zA-Z0-9_]{3,255}$/
                },
                ip: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    is: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
                },
            }, {
                modelName: 'server',
                tableName: 'Server',
                paranoid: false,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                sequelize: sequelize,
            });
        };

        static createServer = async ({projectId = 0, hostname = "", ip = ""}) => {
            const currentProject = await models.project.findByPk(projectId);
            if (currentProject) {
                try {
                    await validateServerData({hostname, ip});
                    const bindValidateSameServerData = validateSameServerData.bind(this);
                    await bindValidateSameServerData({projectId, hostname, ip});
                } catch (e) {
                    throw e;
                }
                return await this.create({
                    hostname: hostname,
                    ip: ip,
                    projectId: projectId
                });
            }
            throw new ServerCommonError("Fail to create server", [{
                text: "Невозможно создать сервер!"
            }]);
        };

        static editServer = async ({projectId = 0, serverId = 0, hostname = "", ip = ""}) => {
            const currentProject = await models.project.findByPk(projectId);
            if (currentProject) {
                const currentServer = await this.findOne({
                    where: {
                        [Op.and]: [
                            {
                                id: serverId
                            },
                            {
                                projectId: projectId
                            }
                        ]
                    }
                });
                if (currentServer) {
                    const [hostnameUser, ipUser] = [currentServer.hostname, currentServer.ip];
                    if (hostname === hostnameUser && ip === ipUser) {
                        throw new ServerNotUpdatedError("The server was not updated", [{
                            text: "Данные о сервере изменены не были!"
                        }]);
                    }
                    try {
                        await validateServerData({hostname, ip});
                        const bindValidateSameServerData = validateSameServerData.bind(this);
                        await bindValidateSameServerData({projectId, hostname, ip, hostnameUser, ipUser}, true);
                    } catch (e) {
                        throw e;
                    }

                    return await this.update({
                        hostname: hostname,
                        ip: ip
                    }, {
                        where: {
                            id: serverId
                        }
                    });
                }
            }
            throw new ServerCommonError("Fail to edit server", [{
                text: "Невозможно обновить сервер!"
            }]);
        }

        static retrieveProjectServers = async ({projectId = 0}) => {
            const currentProject = await models.project.findByPk(projectId);
            if (currentProject) {
                return await this.findAll({
                    where: {
                        projectId: projectId
                    }
                });
            }
            throw new ServerCommonError("Fail to get project servers", [{
                text: "Невозможно получить список серверов у проекта!"
            }]);
        }

        static retrieveProjectServer = async ({serverId = 0, projectId = 0}) => {
            const currentServer = await this.findOne({
                where: {
                    [Op.and]: [
                        {
                            projectId: projectId
                        },
                        {
                            id: serverId
                        }
                    ]
                }
            });
            if (currentServer) {
                return currentServer;
            }
            throw new ServerNotFoundError("Such server not found!", [{
                text: "В данном проекте такого сервера не найдено!"
            }])
        }

        static retrieveServersByTags = async ({tagId = 0}) => {
            const currentTag = await models.tag.findByPk(tagId);
            return await currentTag.getServers();
        }

        static deletionServer = async ({serverId = 0, projectId = 0}) => {
            const currentServer = await this.findOne({
                where: {
                    [Op.and]: [
                        {
                            id: serverId
                        },
                        {
                            projectId: projectId
                        }
                    ]
                }
            });
            if (currentServer) {
                const boundedPermissions = currentServer.getPermissions();
                for (let boundedPermission in boundedPermissions) {

                    if (!boundedPermissions[boundedPermission].countServers()
                        && !boundedPermissions[boundedPermission].countProjects()
                        && !boundedPermissions[boundedPermission].countUsers()
                        && !boundedPermissions[boundedPermission].countDashboard()
                        && !boundedPermissions[boundedPermission].countPermissions()) {
                        currentServer.removePermission(boundedPermissions[boundedPermission]);
                    }
                }
                return await this.destroy({
                    where: {
                        id: serverId
                    }
                });
            }
            throw new ServerDeletionError("Fail to delete the server", [{
                text: "Не удалось удалить сервер!"
            }]);
        }
    }


    return Server;
};