const {models} = require("../../sequelize");
const {Op} = require("sequelize");
const {validate_data} = require("../utils/validate_data_server");

const validate_data_addition = async (req, res, next) => {
    let {hostname, CPU_number} = req.body;
    let messages = validate_data(hostname, CPU_number);
    if (messages.length > 0) {
        res.send({
            status: "danger",
            messages: messages,
            isLoggedIn: req.isAuthenticated()
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
            res.send({
                messages: messages,
                status: "danger",
                isLoggedIn: req.isAuthenticated()
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
        res.send({
            message: "У Вас нет такого сервера!",
            status: "no_server",
            isLoggedIn: req.isAuthenticated()
        });
    } else {
        let {hostname, CPU_number} = req.body;
        let messages = validate_data(hostname, CPU_number);
        if (messages.length > 0) {
            res.send({
                messages: messages,
                status: "danger",
                isLoggedIn: req.isAuthenticated()
            });
        } else {
            if (String(hostname) !== String(server.hostname) || String(server.CPU_number) !== String(CPU_number)) {
                return next();
            } else {
                res.send({
                    message: "Данные изменены не были!",
                    status: "info",
                    isLoggedIn: req.isAuthenticated()
                });
            }
        }
    }
}

module.exports = {
    validate_data_addition,
    validate_data_update
}