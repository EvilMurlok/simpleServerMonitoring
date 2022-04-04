const {models} = require("../../sequelize");

const create_server = async (req, res) => {
    const {hostname, ip, projectId, projectName} = req.body;
    const userId = req.user.id;
    try {
        const createdServer = await models.server.createServer({projectId, projectName, userId, hostname, ip});
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

const retrieve_server_by_tag = async (req, res) => {
    const tagId = req.params.tagId;
    res.send({
        servers: await models.server.retrieveServersByTags({tagId}),
        status: "success",
    });
}

const retrieve_server_in_project = async (req, res) => {
    const [serverId, projectId] = [req.params.serverId, req.params.projectId];
    try {
        const server = models.server.retrieveProjectServer({serverId, projectId});
        res.send({
            status: "success",
            server: server
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
    const {hostname, ip} = req.body;
    try {

        const editedServer = await models.server.editServer({projectId, serverId, hostname, ip});
        res.send({
            status: "success",
            messages: [{
               text: `Сервер ${editedServer.hostname} успешно изменен!`
            }]
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
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

const show_servers_amount = async (req, res) => {
    const servers = await models.server.findAndCountAll({
        where: {
            userId: req.user.id
        },
        order: [ ['createdAt', 'DESC'] ],
        offset: req.params.offset,
        limit: req.params.limit
    });
    res.send({
        servers: servers,
        isLoggedIn: req.isAuthenticated()
    });
}

module.exports = {
    create_server,
    retrieve_project_servers,
    retrieve_server_in_project,
    retrieve_server_by_tag,
    update_server,
    delete_server,
    // show_servers_amount,
}