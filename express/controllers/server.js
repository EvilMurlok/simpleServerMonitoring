const {Op} = require("sequelize");
const {models} = require("../../sequelize");
const generate = require("../utils/generateServer");

// const add_server = async (req, res) => {
//     res.render("./server/add-server.twig", {
//         isAuth: req.isAuthenticated(),
//     });
// }

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
    // req.flash("success_msg", `Сервер ${req.body.hostname} успешно добавлен!`);
    // res.redirect("http://localhost:8081/#/show-servers");
}

const show_servers = async (req, res) => {
    const servers = await models.server.findAll({
        where: {
            userId: req.user.id
        },
        order: [ ['createdAt', 'DESC'] ]
    });
    res.send({
        // title: `Сервера ${req.user.username}`,
        servers: servers,
        isLoggedIn: req.isAuthenticated()
    });
    // res.render("../views/index.twig", {
    //     title: `Сервера ${req.user.username}`,
    //     name: req.user.username,
    //     servers: servers,
    //     isAuth: req.isAuthenticated()
    // });
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
            message: "У вас такого сервера не существует!",
            isLoggedIn: req.isAuthenticated()
        });
        // req.flash("error", "У вас такого сервера не существует!");
        // res.redirect("/show-servers/");
    } else {
        res.send({
            server: server,
            isLoggedIn: req.isAuthenticated()
        });
        // res.render("../views/server/view-server.twig", {
        //     name: req.user.username,
        //     title: server.hostname,
        //     server: server,
        //     isAuth: req.isAuthenticated()
        // });
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
    // req.flash("success_msg", `Сервер ${req.body.hostname} успешно изменен!`);
    // res.redirect("/show-servers/");
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
        // req.flash("error", "У вас нет такого сервера!");
        // res.redirect("/show-servers/");
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
        // req.flash("success_msg", `Сервер ${server.hostname} успешно удален!`);
        // res.redirect("/show-servers/");
    }
}

module.exports = {
    // add_server,
    add_server_post,
    show_servers,
    view_server,
    update_server,
    delete_server
}