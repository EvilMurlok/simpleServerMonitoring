const {Op} = require("sequelize");
const {models} = require("../../sequelize");
const generate = require("../utils/generateServer");

const add_server_post = async (req, res) => {
    const memoryUsage = generate.generateMemoryUsage();
    const memoryLoad = generate.generateMemoryLoad();
    const latency = generate.generateLatency();
    const cpu_load = generate.generateCPULoad();
    const requestAmount = generate.generateRequestsAmount();
    await models.server.create({
        userId: req.user.id,
        hostname: req.body.hostname,
        CPU_number: req.body.CPU_number,
        CPU_load: cpu_load,
        memory_load: memoryLoad,
        memory_usage: memoryUsage,
        requests_amount: requestAmount,
        latency: latency

    });
    res.send({
        status: "success",
        message: `Сервер ${req.body.hostname} успешно добавлен!`,
        isLoggedIn: req.isAuthenticated()
    });
}

const show_servers = async (req, res) => {
    const servers = await models.server.findAll({
        where: {
            userId: req.user.id
        },
        order: [ ['createdAt', 'DESC'] ]
    });
    res.send({
        servers: servers,
        isLoggedIn: req.isAuthenticated()
    });
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

const view_server = async (req, res) => {
    const server = await models.server.findOne({
        where: {
            [Op.and]: {
                id: req.params.serverId,
                userId: req.user.id
            }
        }
    });
    if (!server) {
        res.send({
            status: "danger",
            message: {
                type: 'error',
                text: "У вас такого сервера не существует!"
            },
            // message: "У вас такого сервера не существует!",
            isLoggedIn: req.isAuthenticated()
        });
    } else {
        res.send({
            server: server,
            isLoggedIn: req.isAuthenticated()
        });
    }
}

const update_server = async (req, res) => {
    await models.server.update({
        hostname: req.body.hostname,
        CPU_number: req.body.CPU_number
    }, {
        where: {
            id: req.params.serverId
        }
    });
    res.send({
        message: `Сервер ${req.body.hostname} успешно изменен!`,
        status: "success",
        isLoggedIn: req.isAuthenticated()
    });
}

const delete_server = async (req, res) => {
    const server = await models.server.findOne({
        where: {
            [Op.and]: {
                id: req.params.serverId,
                userId: req.user.id
            }
        }
    });
    if (!server){
        res.send({
            message: "У вас нет такого сервера!",
            status: "danger",
            isLoggedIn: req.isAuthenticated()
        });
    }
    else{
        await models.server.destroy({
            where:{
                id: req.params.serverId
            }
        });
        res.send({
            message: `Сервер ${server.hostname} успешно удален!`,
            status: "success",
            isLoggedIn: req.isAuthenticated()
        });
    }
}

module.exports = {
    add_server_post,
    show_servers,
    show_servers_amount,
    view_server,
    update_server,
    delete_server
}