const {Op} = require("sequelize");
const {models} = require("../../sequelize");

const create_server = async (req, res) => {

}

const retrieve_project_servers = async (req, res) => {

}

const view_server = async (req, res) => {

}

const update_server = async (req, res) => {

}

const delete_server = async (req, res) => {

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
    view_server,
    update_server,
    delete_server,
    // show_servers_amount,
}