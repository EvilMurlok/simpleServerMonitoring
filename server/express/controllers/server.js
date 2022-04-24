const {models} = require("../../sequelize");
const {ServerNotUpdatedError, ServerNotFoundError} = require("../../sequelize/errors/server/serverException");

const create_server = async (req, res) => {
    const {hostname, ip, projectId, projectName} = req.body;
    try {
        const createdServer = await models.server.createServer({projectId, projectName, hostname, ip});
        res.send({
            status: "success",
            messages: [{
                text: `Сервер ${createdServer.hostname} успешно добавлен!`
            }],
            server: createdServer
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieve_user_servers = async (req, res) => {
    const userId = req.user.id;
    const userServers = await models.server.retrieveUserServers({userId});
    res.send({
        status: "success",
        userServers: userServers
    });
}

const retrieve_user_servers_by_hostname_ip = async (req, res) => {
    const [
        userId,
        hostname,
        ip
    ] = [
        req.user.id,
        req.query.hostname,
        req.query.ip
    ];
    const requiredUserServers = await models.server.retrieveUserServersByIpHostname({userId, hostname, ip});
    res.send({
        status: "success",
        requiredUserServers: requiredUserServers
    });
}

const retrieve_filtered_user_servers = async (req, res) => {
    const [
        userId,
        name,
        ip,
        hostname,
        tagName,
        createdMin,
        createdMax
    ] = [
        req.user.id,
        req.query.name,
        req.query.ip,
        req.query.hostname,
        req.query.tag,
        req.query.createdMin,
        req.query.createdMax
    ];
    try {
        const userServers = await models.server.retrieveFilteredUserServers({
            userId,
            name,
            ip,
            hostname,
            tagName,
            createdMin,
            createdMax
        }, tagName !== "%");
        res.send({
            status: "success",
            userServers: userServers
        })
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        })
    }
}

const retrieve_user_sorted_servers = async (req, res) => {
    const [
        userId,
        sortField,
        sortType,
    ] = [
        req.user.id,
        req.params.sortField,
        req.params.sortType,
    ]
    try {
        const userServers = await models.server.retrieveUserSortedServers({userId, sortField, sortType});
        res.send({
            status: "success",
            userServers: userServers,
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieve_project_servers = async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const projectServers = await models.server.retrieveProjectServers({projectId});
        res.send({
            status: "success",
            servers: projectServers
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieve_server_by_tags = async (req, res) => {
    const tagIds = req.body.tagIds;
    res.send({
        servers: await models.server.retrieveServersByTags({tagIds: tagIds}),
        status: "success",
    });
}

const retrieve_server_in_project = async (req, res) => {
    const [serverId, projectId] = [req.params.serverId, req.params.projectId];
    try {
        const projectServer = await models.server.retrieveProjectServer({serverId, projectId});
        res.send({
            status: "success",
            projectServer: projectServer
        })
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const update_server = async (req, res) => {
    const [serverId, projectId] = [req.params.serverId, req.params.projectId];
    const {hostname, ip, newProjectName, tagIds} = req.body;
    let editedServer = "";
    try {
        if (!newProjectName || newProjectName === "Не выбрано") {
            [, editedServer] = await models.server.editServer({projectId, serverId, hostname, ip, tagIds});
        } else {
            [, editedServer] = await models.server.editServer({projectId, serverId, newProjectName, hostname, ip, tagIds});
        }
        res.send({
            status: "success",
            messages: [{
                text: `Сервер ${editedServer.hostname} успешно изменен!`
            }],
            server: editedServer
        });
    } catch (e) {
        if (e instanceof ServerNotUpdatedError) {
            res.send({
                status: "info",
                messages: e.messages
            });
        } else if (e instanceof ServerNotFoundError) {
            res.send({
                status: "not found",
                messages: e.messages
            });
        } else {
            res.send({
                status: "warning",
                messages: e.messages
            });
        }
    }
}

const delete_server = async (req, res) => {
    const [serverId, projectId] = [req.params.serverId, req.params.projectId];
    try {
        const countOfDeletedServers = await models.server.deletionServer({projectId, serverId});
        res.send({
            deletedServers: countOfDeletedServers,
            messages: [{
                text: `Сервер успешно удален!`
            }]
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

module.exports = {
    create_server,
    retrieve_project_servers,
    retrieve_user_servers,
    retrieve_user_servers_by_hostname_ip,
    retrieve_filtered_user_servers,
    retrieve_user_sorted_servers,
    retrieve_server_in_project,
    retrieve_server_by_tags,
    update_server,
    delete_server,
}