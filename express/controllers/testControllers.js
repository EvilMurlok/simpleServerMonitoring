const { models } = require("../../sequelize");
const getPassword = require('../utils/utils');
const register = require("../prometheus/promClientConfig")
const metrics = require("../prometheus/metrics")

const hello = async (req, res) => {
    res.send("Hello, world!");
}

const findAll = async (req, res) => {
    const users = await models.user.findAll({
        attributes: ["username", "createdAt"],
    });
    res.json(users);
}

const findAllServer = async (req, res) => {
    const servers = await models.server.findAll();
    res.json(servers);
}

const addUser = async (req, res) => {
    if (!req.body.password){
        res.status(403).send({error: "Password required!"});
    }
    const user = await models.user.create({ username: req.body.username,  password: getPassword(req.body.password) })
        .catch(err => { res.status(403).send({error: err}); });
    res.status(201).json(user);
}

const get_metrics = async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
}

const increment_counter =  async (req, res) => {
    metrics.buttonClicksCounter.inc()
    res.send('4u4a')
}

module.exports = {
    hello,
    findAll,
    addUser,
    findAllServer,
    get_metrics,
    increment_counter,
}