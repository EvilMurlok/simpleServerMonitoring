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
                    await adminPermission.addServer(createdServer, {transaction: t});
                    await t.commit();
                    return createdServer;
                } catch (e) {
                    console.error(e);
                    await t.rollback();
                    throw new ServerTransactionError("An error occurred during the transaction", [{text: "???? ?????????????? ???????????????? ???????????? ?? ???????????????? ?????????? ????????????????????????????!"}]);
                }
            }
            throw new ServerCommonError("Fail to create server", [{
                text: "???????????????????? ?????????????? ????????????!"
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
                        if (hostname === hostnameUser && ip === ipUser && (currentProject.name === newProjectName || !newProjectName || newProjectName === "???? ??????????????") && isSameTags) {
                            throw new ServerNotUpdatedError("The server was not updated", [{
                                text: "???????????? ?? ?????????????? ???????????????? ???? ????????!"
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

                        /**
                         * WE SHOULD COPY ALL NEW SERVER AND TAGS TO ALL ADMIN PERMISSIONS OF THE ANOTHER PROJECT
                         * AND ALL THE ANOTHER PERMISSIONS OF NEW PROJECT STAY WITHOUT ANY CHANGES!
                         */

                            // if the new project we should move
                            // the server from all currentProjectPermissions to newProjectPermissions
                        const currentProjectPermissions = await currentProject.getPermissions({}, {transaction: t});
                        const newProjectPermissions = await newProjectByName.getPermissions({where: {name: `admin${newProjectName}`}}, {transaction: t});

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
                            throw new ServerTransactionError("An error occurred during the transaction", [{text: "???? ?????????????? ???????????????? ???????????? ?? ???????????????? ??????????, ?????????????????? ?? ????????????????!"}]);
                        }
                    }

                } else {
                    throw new ServerNotFoundError("Such server not found", [{
                        text: "?????????? ???????????? ???? ????????????!"
                    }]);
                }
            }
            throw new ServerCommonError("Fail to edit server", [{
                text: "???????????????????? ???????????????? ????????????!"
            }]);
        }

        static retrieveUserServersByIpHostname = async ({userId, ip = "%", hostname = "%"}) => {
            console.log(ip, hostname, userId);
            const availableServers = await sequelize.models.user.findAll({
                where: {id: userId},
                attributes: ["id"],
                include: {
                    model: sequelize.models.permission,
                    required: true,
                    attributes: ["id", "name"],
                    include: {
                        model: sequelize.models.server,
                        require: true,
                        attributes: ["ip", "hostname"],
                        where: {
                            ip: {[Op.iLike]: `%${ip}%`},
                            hostname: {[Op.iLike]: `%${hostname}%`}
                        }
                    }
                }
            })
            let servers = [];
            const tempHostnames = [];
            if (availableServers.length && availableServers[0].permissions.length) {
                for (let permission of availableServers[0].permissions) {
                    if (ip === "%" && hostname !== "%") {
                        for (let server of permission.servers) {
                            if (!servers.includes(server.hostname)) {
                                servers.push(server.hostname);
                            }
                        }
                    } else if (hostname === "%" && ip !== "%") {
                        for (let server of permission.servers) {
                            if (!servers.includes(server.ip)) {
                                servers.push(server.ip);
                            }
                        }
                    } else {
                        for (let server of permission.servers) {
                            if (!tempHostnames.includes(server.hostname)) {
                                tempHostnames.push(server.hostname);
                                servers.push({
                                    hostname: server.hostname,
                                    ip: server.ip
                                });
                            }
                        }
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

        static retrieveAvailableUserProjectsWithServers = async ({
                                                                     userId,
                                                                     name,
                                                                     ip,
                                                                     hostname,
                                                                     tagName,
                                                                     createdMin,
                                                                     createdMax
                                                                 }) => {
            console.log("QQQQQQQ", name, ip, hostname);
            const availableProjectsToCreateTag = await sequelize.models.project.findAll({
                where: {userId: {[Op.ne]: userId}, name: {[Op.iLike]: `%${name}%`}},
                attributes: ["id", "name"],
                include: {
                    model: sequelize.models.permission,
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: sequelize.models.ability,
                            required: true,
                            where: {
                                entity: "Tag",
                                action: "Create"
                            },
                            attributes: [],
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
            });
            const availableProjects = [];
            for (let project of availableProjectsToCreateTag) {
                const tempProject = await sequelize.models.project.findOne({
                    where: {
                        id: project.id
                    },
                    attributes: ["id", "name", "userId"],
                    include: {
                        model: sequelize.models.server,
                        required: true,
                        attributes: ["id", "hostname", "ip"],
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
                        include: [
                            {
                                model: sequelize.models.permission,
                                attributes: ["id"],
                                through: {attributes: []},
                                required: true,
                                include: [
                                    {
                                        model: sequelize.models.ability,
                                        required: true,
                                        where: {
                                            entity: "Server",
                                            action: "Update"
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
                            },
                            {
                                model: sequelize.models.tag,
                                required: tagName !== "%",
                                attributes: ["id", "name", "color"],
                                where: {
                                    name: {
                                        [Op.iLike]: `%${tagName}%`
                                    }
                                },
                                through: {attributes: []}
                            }
                        ],
                    }
                });
                if (tempProject) {
                    availableProjects.push(tempProject);
                }
            }
            return availableProjects;
        }

        static retrieveFilteredUserServers = async ({
                                                        userId,
                                                        name,
                                                        ip,
                                                        hostname,
                                                        tagName,
                                                        createdMin,
                                                        createdMax
                                                    }) => {
            return await sequelize.models.user.findAll({
                where: {
                    id: userId
                },
                attributes: [],
                include: {
                    model: sequelize.models.project,
                    required: true,
                    attributes: ["id", "name", "userId"],
                    where: {
                        name: {
                            [Op.iLike]: `%${name}%`,
                        }
                    },
                    include: {
                        model: sequelize.models.server,
                        required: true,
                        attributes: ["id", "hostname", "ip", "created"],
                        where: {
                            hostname: {
                                [Op.iLike]: `%${hostname}%`
                            },
                            ip: {
                                [Op.iLike]: `%${ip}%`
                            },
                            created: {
                                [Op.gte]: createdMin,
                                [Op.lte]: createdMax
                            }
                        },
                        include: {
                            model: sequelize.models.tag,
                            required: tagName !== "%",
                            attributes: ["id", "name", "color"],
                            where: {
                                name: {
                                    [Op.iLike]: `%${tagName}%`
                                }
                            },
                            through: {attributes: []}
                        }
                    }
                },
                order: [[sequelize.models.project, "name", "DESC"]]
            });
        }

        static retrieveAvailableUserServers = async ({
                                                         userId = 0,
                                                         name = "%",
                                                         ip = "%",
                                                         hostname = "%",
                                                         tagName = "%",
                                                         createdMin = "1970-01-01T00:00:00.000Z",
                                                         createdMax = new Date(new Date().setHours(new Date().getHours() + 3)).toISOString()
                                                     }) => {
            const availableUserServers = await this.findAll({
                where: {
                    hostname: {
                        [Op.iLike]: `%${hostname}%`
                    },
                    ip: {
                        [Op.iLike]: `%${ip}%`
                    },
                    created: {
                        [Op.gte]: createdMin,
                        [Op.lte]: createdMax
                    }
                },
                attributes: ["id", "hostname", "ip", "created"],
                include: [
                    {
                        model: sequelize.models.permission,
                        attributes: ["id"],
                        through: {attributes: []},
                        required: true,
                        include: [
                            {
                                model: sequelize.models.project,
                                attributes: ["id", "name"],
                                required: true,
                                where: {
                                    userId: {
                                        [Op.ne]: userId
                                    },
                                    name: {
                                        [Op.iLike]: `%${name}%`
                                    }
                                }
                            },
                            {
                                model: sequelize.models.ability,
                                required: true,
                                where: {
                                    entity: "Server",
                                    action: {
                                        [Op.in]: ["Retrieve", "Update", "Delete"]
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
                    },
                    {
                        model: sequelize.models.tag,
                        attributes: ["id", "name", "color"],
                        required: tagName !== "%",
                        through: {attributes: []},
                        include: {
                            model: sequelize.models.permission,
                            attributes: ["id"],
                            through: {attributes: []},
                            required: true,
                            include: [
                                {
                                    model: sequelize.models.ability,
                                    required: true,
                                    where: {
                                        entity: "Tag",
                                        action: {
                                            [Op.in]: ["Retrieve", "Update", "Delete"]
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
                    }
                ],
                order: [["hostname", "DESC"]]
            });

            const availableServers = [];
            const alreadyAddedServers = [];
            for (let availableUserServer of availableUserServers) {
                if (!alreadyAddedServers.includes(availableUserServer.ip)) {
                    let [isAbleToDelete, isAbleToUpdate] = [false, false];
                    let projectName = "";
                    for (let permission of availableUserServer.permissions) {
                        projectName = permission.project.name;
                        for (let ability of permission.abilities) {
                            if (ability.entity === "Server" && ability.action === "Update") {
                                isAbleToUpdate = true;
                            }
                            if (ability.entity === "Server" && ability.action === "Delete") {
                                isAbleToDelete = true;
                            }
                        }
                    }
                    const tagsOfServer = [];
                    for (let tag of availableUserServer.tags) {
                        tagsOfServer.push({
                            id: tag.id,
                            name: tag.name,
                            color: tag.color
                        });
                    }
                    tagsOfServer.sort((lhs, rhs) => {
                        if (lhs.name > rhs.name) {
                            return 1;
                        } else if (lhs.name < rhs.name) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    availableServers.push({
                        id: availableUserServer.id,
                        hostname: availableUserServer.hostname,
                        ip: availableUserServer.ip,
                        created: availableUserServer.created,
                        isAbleToUpdate: isAbleToUpdate,
                        isAbleToDelete: isAbleToDelete,
                        tags: tagsOfServer,
                        projectName: projectName,
                    });
                    alreadyAddedServers.push(availableUserServer.ip);
                }
            }
            return availableServers;
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
                text: "???????????????????? ???????????????? ???????????? ???????????????? ?? ??????????????!"
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
                    attributes: ["id", "hostname", "ip", "created"],
                    include: {
                        model: sequelize.models.tag,
                        required: false,
                        attributes: ["id", "name", "color"],
                        through: {attributes: []}
                    }
                },
            });
            if (currentServer) {
                return currentServer;
            }
            throw new ServerNotFoundError("Such server not found!", [{
                text: "?? ???????????? ?????????????? ???????????? ?????????????? ???? ??????????????!"
            }]);
        }

        static retrieveServer = async ({userId = 0, serverId = 0}) => {
            const currentServer = await this.findOne({
                where: {id: serverId},
                attributes: ["id", "hostname", "ip", "created", "projectId"],
                include: [
                    {
                        model: sequelize.models.permission,
                        attributes: ["id"],
                        through: {attributes: []},
                        required: true,
                        include: [
                            {
                                model: sequelize.models.ability,
                                required: true,
                                where: {
                                    entity: "Server",
                                    action: {
                                        [Op.in]: ["Retrieve", "Update", "Delete"]
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
                    },
                    {
                        model: sequelize.models.tag,
                        attributes: ["id", "name", "color"],
                        required: false,
                        through: {attributes: []},
                        include: {
                            model: sequelize.models.permission,
                            attributes: ["id"],
                            through: {attributes: []},
                            required: true,
                            include: [
                                {
                                    model: sequelize.models.ability,
                                    required: true,
                                    where: {
                                        entity: "Tag",
                                        action: {
                                            [Op.in]: ["Retrieve"]
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
                    }
                ]
            });
            if (currentServer) {
                const project = await sequelize.models.project.findByPk(currentServer.projectId);
                let [isAbleToUpdate, isAbleToDelete] = [false, false];
                for (let permission of currentServer.permissions) {
                    for (let ability of permission.abilities) {
                        if (ability.entity === "Server" && ability.action === "Update") {
                            isAbleToUpdate = true;
                        }
                        if (ability.entity === "Server" && ability.action === "Delete") {
                            isAbleToDelete = true;
                        }
                    }
                }
                const [availableProjectsNames, availableTags] = [[], []];
                let [availableProjects, serverTags] = [[], currentServer.tags];
                if (isAbleToUpdate) {
                    serverTags = (await this.findOne({
                       where: {id: serverId},
                        include: {
                            model: sequelize.models.tag,
                            attributes: ["id", "name", "color"],
                            through: {attributes: []},
                        }
                    })).tags;
                    availableProjects = await sequelize.models.project.findAll({
                        attributes: ["name"],
                        include: {
                            model: sequelize.models.permission,
                            required: true,
                            attributes: ["id", "name", "projectId"],
                            include: [
                                {
                                    model: sequelize.models.ability,
                                    required: true,
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
                        },
                        order: [["name", "DESC"]]
                    });
                    for (let project of availableProjects) {
                        if (!availableProjectsNames.includes(project.name)) {
                            availableProjectsNames.push(project.name);
                        }
                    }

                    const tempAvailableTags = await sequelize.models.tag.findAll({
                        attributes: ["id", "name", "color"],
                        order: [["name", "ASC"]]
                    });
                    const availableTagsIds = [];
                    for (let tag of tempAvailableTags) {
                        if (!availableTagsIds.includes(tag.id)) {
                            availableTagsIds.push(tag.id);
                            availableTags.push({
                                id: tag.id,
                                name: tag.name,
                                color: tag.color
                            });
                        }
                    }
                }
                const tagsOfServer = [];
                const tagsIdsOfServer = [];
                for (let tag of serverTags) {
                    if (!tagsIdsOfServer.includes(tag.id)) {
                        tagsOfServer.push({
                            id: tag.id,
                            name: tag.name,
                            color: tag.color
                        });
                        tagsIdsOfServer.push(tag.id);
                    }
                }
                return [
                    {
                        id: currentServer.id,
                        hostname: currentServer.hostname,
                        ip: currentServer.ip,
                        created: currentServer.created,
                        isAbleToUpdate: isAbleToUpdate,
                        isAbleToDelete: isAbleToDelete
                    },
                    {id: project.id, name: project.name},
                    availableProjectsNames,
                    tagsOfServer,
                    tagsIdsOfServer,
                    availableTags
                ];
            }
            throw new ServerNotFoundError("Such server not found!", [{
                text: "?????????????? ???? ????????????!"
            }]);
        }

        static retrieveProjectServerByHostname = async ({hostname = "", projectId = 0}) => {
            const currentServer = await this.findOne({
                where: {
                    projectId: projectId,
                    hostname: hostname
                }
            });
            if (currentServer) {
                return currentServer;
            }
            throw new ServerNotFoundError("Such server not found!", [{
                text: "?? ???????????? ?????????????? ???????????? ?????????????? ???? ??????????????!"
            }]);
        }

        static retrieveServersByTags = async ({tagIds = []}) => {
            const tags = await sequelize.models.tag.findAll({
                where: {
                    id: tagIds
                }
            });

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
                text: "?? ???????????? ?????????????? ???????????? ?????????????? ???? ??????????????!"
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
                    id: serverId,
                    projectId: projectId
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
                text: "???? ?????????????? ?????????????? ????????????!"
            }]);
        }
    }


    return Server;
};