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
                paranoid: true,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                deletedAt: 'deleted',
                sequelize: sequelize,
            });
        };

        static createServer = async ({projectId = 0, projectName = "", hostname = "", ip = ""}) => {
            const currentProjectById = await models.project.findByPk(projectId);
            const currentProjectByName = await models.project.findOne({
                where: {
                    name: projectName
                }
            });
            if (currentProjectByName || currentProjectById) {
                projectId = projectId || currentProjectByName.id
                try {
                    await validateServerData({hostname, ip});
                    await validateSameServerData.bind(this)({projectId, hostname, ip});
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

        static editServer = async ({projectId = 0, serverId = 0, newProjectName = "", hostname = "", ip = ""}) => {
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
                            },
                            {
                                deleted: {
                                    [Op.is]: null
                                }
                            }
                        ]
                    }
                });
                if (currentServer) {
                    const [hostnameUser, ipUser] = [currentServer.hostname, currentServer.ip];
                    if (hostname === hostnameUser && ip === ipUser && (currentProject.name === newProjectName || !newProjectName || newProjectName === "Не выбрано")) {
                        throw new ServerNotUpdatedError("The server was not updated", [{
                            text: "Данные о сервере изменены не были!"
                        }]);
                    }
                    try {
                        await validateServerData({hostname, ip});
                        await validateSameServerData.bind(this)({projectId, hostname, ip, hostnameUser, ipUser}, true);
                    } catch (e) {
                        throw e;
                    }
                    newProjectName = newProjectName || currentProject.name;
                    const newProjectByName = await models.project.findOne({
                        where: {
                            [Op.and]: [
                                {
                                    name:  newProjectName
                                },
                                {
                                    deleted: {
                                        [Op.is]: null
                                    }
                                }
                            ]
                        }
                    });
                    return [await this.update({
                        hostname: hostname,
                        ip: ip,
                        projectId: newProjectByName.id
                    }, {
                        where: {
                            id: serverId
                        }
                    }), {hostname, ip, newProjectName}];
                } else {
                    throw new ServerNotFoundError("Such server not found", [{
                        text: "Такой сервер не найден!"
                    }]);
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
                        [Op.and]: [
                            {
                                projectId: projectId
                            },
                            {
                                deleted: {
                                    [Op.is]: null
                                }
                            }
                        ]
                    }
                });
            }
            throw new ServerCommonError("Fail to get project servers", [{
                text: "Невозможно получить список серверов у проекта!"
            }]);
        }

        static retrieveProjectServer = async ({serverId = 0, projectId = 0}) => {
            const currentServer = await models.project.findOne({
                attributes: ["name"],
                include: {
                    model: models.server,
                    required: true,
                    where: {
                        [Op.and]: [
                            {
                                id: serverId
                            },
                            {
                                deleted: {
                                    [Op.is]: null
                                }
                            }
                        ]
                    }
                },
                where: {
                    [Op.and]: [
                        {
                            id: projectId
                        },
                        {
                            deleted: {
                                [Op.is]: null
                            }
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

        static retrieveProjectServerByHostname = async ({hostname = "", projectId = 0}) => {
            const currentServer = await this.findOne({
                where: {
                    [Op.and]: [
                        {
                            projectId: projectId
                        },
                        {
                            hostname: hostname
                        },
                        {
                            deleted: {
                                [Op.is]: null
                            }
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

        static retrieveServersByTags = async ({tagIds = []}) => {
            const tags = await models.tag.findAll({
                where: {
                    id: tagIds
                }
            })

            let servers = [];
            for (let tag of tags) {
                servers.push(...await tag.getServers());
            }

            return servers;
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
                        },
                        {
                            deleted: {
                                [Op.is]: null
                            }
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