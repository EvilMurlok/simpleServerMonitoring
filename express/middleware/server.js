const {models} = require("../../sequelize");
const {Op} = require("sequelize");
const {validate_data} = require("../utils/validate_data_server");

const validate_data_addition = async (req, res, next) => {
    let {hostname, CPU_number} = req.body;
    let messages = validate_data(hostname, CPU_number);
    if (messages.length > 0) {
        res.render("./server/add-server.twig", {
            info: messages,
            status: "danger",
            hostname,
            CPU_number,
            isAuth: req.isAuthenticated()
        });
    } else {
        const server = await models.server.findOne({
            where: {
                [Op.and]: {
                    userId: req.user.id,
                    hostname: hostname
                }
            }
        });
        if (server) {
            messages.push({message: "У Вас уже есть сервер с таким наименованием!"});
            res.render("./server/add-server.twig", {
                info: messages,
                status: "danger",
                hostname,
                CPU_number,
                isAuth: req.isAuthenticated()
            });
        } else {
            return next();
        }
    }
}

const validate_data_update = async (req, res, next) => {
    const server = await models.server.findOne({
        where: {
            [Op.and]: {
                id: req.params.serverId,
                userId: req.user.id
            }
        }
    });
    if (!server) {
        req.flash("error", "У Вас нет такого сервера!");
        res.redirect("/show-servers/");
    } else {
        let {hostname, CPU_number} = req.body;
        let messages = validate_data(hostname, CPU_number);
        if (messages.length > 0) {
            res.render("./server/view-server.twig", {
                info: messages,
                status: "danger",
                server,
                isAuth: req.isAuthenticated()
            });
        } else {
            console.log(server.hostname, hostname, server.CPU_number, CPU_number);
            if (hostname != server.hostname || server.CPU_number != CPU_number) {
                return next();
            } else {
                req.flash("info", "Данные изменены не были!");
                res.redirect("/show-servers/");
            }
        }
    }
}

module.exports = {
    validate_data_addition,
    validate_data_update
}