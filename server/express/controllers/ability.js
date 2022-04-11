const {models, Op} = require("../../sequelize");


const retrieveAllByEntity = async (req, res) => {
    const entity = req.body.entity;
    try {
        const abilities = await models.ability.retrieveAllByEntity({
            entity: entity,
        });
        res.send({
            status: "success",
            messages: [{
                text: `Успешно получен список Возможностей для сущности ${entity}`
            }],
            abilities: abilities
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieveAllByEntityAction = async (req, res) => {
    const {entity, action} = req.body;
    try {
        const abilities = await models.ability.retrieveAllByEntityAction({
            entity: entity,
            action: action,
        });
        res.send({
            status: "success",
            messages: [{
                text: `Успешно получены Возможности для сущности ${entity} и действия ${action}`
            }],
            abilities: abilities
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieveAllByEntityDetail = async (req, res) => {
    const {entity, detail} = req.body;
    try {
        const abilities = await models.ability.retrieveAllByEntityDetail({
            entity: entity,
            detail: detail,
        });
        res.send({
            status: "success",
            messages: [{
                text: `Успешно получены Возможности для сущности ${entity} и уточнения ${detail}`
            }],
            abilities: abilities
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieveSpecificOne = async (req, res) => {
    const {entity, action, detail} = req.body;
    try {
        const ability = await models.ability.retrieveSpecificOne({
            entity: entity,
            action: action,
            detail: detail,
        });
        res.send({
            status: "success",
            messages: [{
                text: `Успешно получена Возможность ${ability.name}`
            }],
            ability: ability
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}


module.exports = {
    retrieveAllByEntity,
    retrieveAllByEntityAction,
    retrieveAllByEntityDetail,
    retrieveSpecificOne
}
