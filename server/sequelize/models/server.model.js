const {Op, Model, DataTypes} = require("sequelize");

const {
    ServerCommonError, ServerDeletionError,
    ServerNotUpdatedError, ServerNotFoundError,
    ServerTransactionError, ServerCredentialsError,
    ServerSameCredentialsError
} = require("../errors/server/serverException");
const {validateServerData} = require("../utils/server/validationServerData");
const {validateSameServerData} = require("../utils/server/validationSameServerData");
const {getAllTagsOfServers} = require("../utils/server/getAllTagsOfServers")

module.exports = (sequelize) => {
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
            const currentProjectById = await sequelize.models.project.findByPk(projectId);
            const currentProjectByName = await sequelize.models.project.findOne({
                where: {
                    name: projectName
                }
            });
            const currentProject = currentProjectByName || currentProjectById;
            if (currentProject) {
                projectId = projectId || currentProjectByName.id
                try {
                    await validateServerData({hostname, ip});
                    await validateSameServerData.bind(this)({projectId, hostname, ip});
                } catch (e) {
                    throw e;
                }
                const t = await sequelize.transaction();
                try {
                    const createdServer = await this.create({
                        hostname: hostname,
                        ip: ip,
                        projectId: projectId
                    }, {transaction: t});
                    let adminPermission = await currentProject.getPermissions({
                        where: {
                            name: `admin${currentProject.name}`
                        }
                    }, {transaction: t});
                    adminPermission = adminPermission[0];
                    console.log(adminPermission);
                    await adminPermission.addServer(createdServer, {transaction: t});
                    await t.commit();
                    return createdServer;
                } catch (e) {
                    console.error(e);
                    await t.rollback();
                    throw new ServerTransactionError("An error occurred during the transaction", [{text: "Не удалось добавить сервер и обновить права администратора!"}]);
                }
            }
            throw new ServerCommonError("Fail to create server", [{
                text: "Невозможно создать сервер!"
            }]);
        };

        static editServer = async ({
                                       projectId = 0,
                                       serverId = 0,
                                       newProjectName = "",
                                       hostname = "",
                                       ip = "",
                                       tagIds = []
                                   }) => {
            const currentProject = await sequelize.models.project.findByPk(projectId);
            if (currentProject) {
                const currentServer = await this.findOne({
                    where: {
                        id: serverId,
                        projectId: projectId
                    }
                });
                if (currentServer) {
                    const t = await sequelize.transaction();
                    try {
                        const currentServerTags = await currentServer.getTags({}, {transaction: t});
                        const currentServerTagsIds = currentServerTags.map(tag => tag.id);
                        let isSameTags = currentServerTagsIds.length === tagIds.length;
                        if (isSameTags) {
                            for (let tagIdIndex in tagIds) {
                                if (tagIds[tagIdIndex] !== currentServerTagsIds[tagIdIndex]) {
                                    isSameTags = false;
                                    break;
                                }
                            }
                        }
                        const [hostnameUser, ipUser] = [currentServer.hostname, currentServer.ip];
                        if (hostname === hostnameUser && ip === ipUser && (currentProject.name === newProjectName || !newProjectName || newProjectName === "Не выбрано") && isSameTags) {
                            throw new ServerNotUpdatedError("The server was not updated", [{
                                text: "Данные о сервере изменены не были!"
                            }]);
                        }
                        try {
                            await validateServerData({hostname, ip});
                            await validateSameServerData.bind(this)({
                                projectId,
                                hostname,
                                ip,
                                hostnameUser,
                                ipUser
                            }, true);
                        } catch (e) {
                            throw e;
                        }
                        newProjectName = newProjectName || currentProject.name;
                        const newProjectByName = await sequelize.models.project.findOne({
                            where: {name: newProjectName}
                        }, {transaction: t});
                        const chosenTags = await sequelize.models.tag.findAll({
                            where: {id: tagIds}
                        }, {transaction: t});
                        await currentServer.setTags(chosenTags, {transaction: t});

                        // if the new project we should move
                        // the server from all currentProjectPermissions to newProjectPermissions
                        const currentProjectPermissions = await currentProject.getPermissions({}, {transaction: t});
                        const newProjectPermissions = await newProjectByName.getPermissions({}, {transaction: t});

                        const newProjectServers = await newProjectByName.getServers({}, {transaction: t});
                        const currentProjectServers = await currentProject.getServers({where: {ip: {[Op.ne]: currentServer.ip}}}, {transaction: t});
                        // we should check if the list of the server tags was changed and move them from currentProjectPermissions to newProjectPermissions
                        // get all currentProjectServers beside the currentServer
                        if (currentProject.name !== newProjectByName.name) {
                            // change the PermissionServer table if the other project has been chosen
                            for (let currentProjectPermission of currentProjectPermissions) {
                                await currentProjectPermission.removeServers([currentServer], {transaction: t});
                            }
                            for (let newProjectPermission of newProjectPermissions) {
                                await newProjectPermission.addServers([currentServer], {transaction: t});
                            }

                            // change the PermissionTag table if the other project has been chosen

                            // newProjectServers.push(currentServer);

                            const allNewProjectTagsIds = await getAllTagsOfServers(newProjectServers);

                            for (let chosenTag of chosenTags) {
                                if (!allNewProjectTagsIds.has(chosenTag.id)) {
                                    for (let newProjectPermission of newProjectPermissions) {
                                        await newProjectPermission.addTags([chosenTag], {transaction: t});
                                    }
                                }
                            }

                            const allCurrentProjectTagsIds = await getAllTagsOfServers(currentProjectServers);

                            for (let currentServerTag of currentServerTags) {
                                if (!allCurrentProjectTagsIds.has(currentServerTag.id)) {
                                    for (let currentProjectPermission of currentProjectPermissions) {
                                        await currentProjectPermission.removeTags([currentServerTag], {transaction: t});
                                    }
                                }
                            }

                            console.log(allCurrentProjectTagsIds);

                        } else {
                            if (!isSameTags) {

                                // for each server we should get all tags without repetition
                                const allProjectTagsIds = await getAllTagsOfServers(currentProjectServers);

                                console.log(allProjectTagsIds);
                                // we should find all tags which don't belong to allProjectTagsIds and belong to currentServer and don't belong to newServer
                                // remove them from all currentProjectPermissions
                                for (let currentServerTag of currentServerTags) {
                                    if (!allProjectTagsIds.has(currentServerTag.id) && !tagIds.includes(currentServerTag.id)) {
                                        for (let currentProjectPermission of currentProjectPermissions) {
                                            await currentProjectPermission.removeTags([currentServerTag], {transaction: t});
                                        }
                                    }
                                }


                                // we should find all tags which belong to newServer and don't belong to allProjectTagsIds and don't belong to currentServer
                                // add them to all currentProjectPermissions
                                for (let chosenTag of chosenTags) {
                                    if (!allProjectTagsIds.has(chosenTag.id) && !currentServerTagsIds.includes(chosenTag.id)) {
                                        for (let currentProjectPermission of currentProjectPermissions) {
                                            await currentProjectPermission.addTags([chosenTag], {transaction: t});
                                        }
                                    }
                                }
                            }
                        }

                        console.log("UPDATE!");
                        const updatedServer = [await this.update({
                            hostname: hostname,
                            ip: ip,
                            projectId: newProjectByName.id
                        }, {
                            where: {
                                id: serverId
                            }
                        }, {transaction: t}), {hostname, ip, newProjectName}];

                        await t.commit();
                        return updatedServer;
                    } catch (e) {
                        console.error(e);
                        await t.rollback();
                        if (e instanceof ServerNotUpdatedError || e instanceof ServerCredentialsError || e instanceof ServerSameCredentialsError) {
                            throw e;
                        } else {
                            console.error(e);
                            throw new ServerTransactionError("An error occurred during the transaction", [{text: "Не удалось изменить сервер и обновить права, связанные с сервером!"}]);
                        }
                    }

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

        static retrieveUserServersByIpHostname = async ({userId, ip = "%", hostname = "%"}) => {
            console.log(ip, hostname, userId);
            const currentUserWithFoundServers = await sequelize.models.user.findAll({
                where: {id: userId},
                include: {
                    model: sequelize.models.project,
                    required: true,
                    include: {
                        model: sequelize.models.server,
                        required: true,
                        attributes: ["ip", "hostname"],
                        where: {
                            ip: {[Op.iLike]: `%${ip}%`},
                            hostname: { [Op.iLike]: `%${hostname}%`}
                        }
                    }
                }
            });
            let servers = [];
            if (currentUserWithFoundServers.length && currentUserWithFoundServers[0].projects.length) {
                for (let project of currentUserWithFoundServers[0].projects) {
                    if (ip === "%" && hostname !== "%") {
                        servers = [...servers, ...(project.servers.map(server => server.hostname))];
                    } else if (hostname === "%" && ip !== "%") {
                        servers = [...servers, ...(project.servers.map(server => server.ip))];
                    } else {
                        servers = [...servers, ...(project.servers.map(server => {
                            return {
                                hostname: server.hostname,
                                ip: server.ip
                            };
                        }))];
                    }
                }
                return servers;
            } else {
                return [];
            }
        }

        static retrieveUserServers = async ({userId = 0}) => {
            return await sequelize.models.user.findAll({
                where: {
                    id: userId
                },
                include: {
                    model: sequelize.models.project,
                    required: true,
                    include: {
                        model: sequelize.models.server,
                        required: true,
                        include: {
                            model: sequelize.models.tag,
                            required: false,
                        }
                    }
                },
                order: [[sequelize.models.project, "name", "DESC"], [sequelize.models.project, sequelize.models.server, "hostname", "ASC"]]
            });
        }

        static retrieveFilteredUserServers = async ({
                                                        userId,
                                                        name,
                                                        ip,
                                                        hostname,
                                                        tagName,
                                                        createdMin,
                                                        createdMax
                                                    }, isFilterTag = false) => {
            return await sequelize.models.user.findAll({
                where: {
                    id: userId
                },
                include: {
                    model: sequelize.models.project,
                    required: true,
                    where: {
                        name: {
                            [Op.iLike]: `%${name}%`,
                        }
                    },
                    include: {
                        model: sequelize.models.server,
                        required: true,
                        where: {
                            [Op.and]: [
                                {
                                    hostname: {
                                        [Op.iLike]: `%${hostname}%`
                                    }
                                },
                                {
                                    ip: {
                                        [Op.iLike]: `%${ip}%`
                                    }
                                },
                                {
                                    created: {
                                        [Op.gte]: createdMin
                                    }
                                },
                                {
                                    created: {
                                        [Op.lte]: createdMax
                                    }
                                }
                            ]
                        },
                        include: {
                            model: sequelize.models.tag,
                            required: isFilterTag,
                            where: {
                                name: {
                                    [Op.iLike]: `%${tagName}%`
                                }
                            }
                        }
                    }
                },
                order: [[sequelize.models.project, "name", "DESC"]]
            });
        }

        static retrieveUserSortedServers = async ({
                                                      userId = 0,
                                                      sortField,
                                                      sortType,
                                                  }) => {
            return await sequelize.models.user.findAll({
                where: {
                    id: userId
                },
                include: {
                    model: sequelize.models.project,
                    required: true,
                    include: {
                        model: sequelize.models.server,
                        required: true,
                    },
                },
                order: [[sequelize.models.project, sortField, sortType]]
            });

        }

        static retrieveProjectServers = async ({projectId = 0}) => {
            const currentProject = await sequelize.models.project.findByPk(projectId);
            if (currentProject) {
                return await this.findAll({
                    where: {projectId: projectId}
                });
            }
            throw new ServerCommonError("Fail to get project servers", [{
                text: "Невозможно получить список серверов у проекта!"
            }]);
        }

        static retrieveProjectServer = async ({serverId = 0, projectId = 0}) => {
            const currentServer = await sequelize.models.project.findOne({
                attributes: ["name"],
                where: {id: projectId},
                include: {
                    model: sequelize.models.server,
                    required: true,
                    where: {id: serverId},
                    include: {
                        model: sequelize.models.tag,
                        required: false,
                    }
                },
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
                        }
                    ]
                }
            });
            if (currentServer) {
                return currentServer;
            }
            throw new ServerNotFoundError("Such server not found!", [{
                text: "В данном проекте такого сервера не найдено!"
            }]);
        }

        static retrieveServersByTags = async ({tagIds = []}) => {
            const tags = await sequelize.models.tag.findAll({
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

        static retrieveAllServerTags = async ({serverId = 0}) => {
            const currentServer = await sequelize.models.server.findByPk(serverId);
            if (currentServer) {
                return await currentServer.getTags();
            }
            throw new ServerNotFoundError("Such server not found!", [{
                text: "В данном проекте такого сервера не найдено!"
            }]);
        }

        static getProjectsByServers = async ({serverIds = []}) => {
            const projectIds = new Set();
            for (let serverId of serverIds) {
                projectIds.add((await this.findByPk(serverId)).projectId);
            }

            return await sequelize.models.project.findAll({
                where: {
                    id: Array.from(projectIds)
                }
            });
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