const {models} = require("../../sequelize");

const create_tag = async (req, res) => {
    const {tagName, serverIds} = req.body;
    try {
        const createdTag = await models.tag.createWithName({
            tagName: tagName,
            serverIds: serverIds
        });
        res.send({
            status: "success",
            messages: [{
                text: `Тэг ${createdTag.name} успешно добавлен!`
            }],
            tag: createdTag
        });
    } catch (e) {
        res.send({
            status: "warning",
            message: e.message,
            messages: e.messages
        });
    }
}

const edit_tag = async (req, res) => {
    const {name, color, serverIds} = req.body;
    console.log(name, color, serverIds);
    const tagId = req.params.tagId;
    console.log(tagId);

    try {
        let tagToEdit = await models.tag.findByPk(tagId);
        await tagToEdit.editWithValidation({tagName: name, color: color, serverIds: serverIds});
        res.send({
            status: "success",
            messages: [{
                text: `Тэг ${tagToEdit.name} успешно отредактирован!`
            }],
            tag: tagToEdit
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieveTagByIdName = async (req, res) => {
    const {tagId, tagName} = req.body;
    try {
        const tag = await models.tag.findOneWithName({tagId: tagId, tagName: tagName});
        res.send({
           status: "success",
           tag: tag
        });
    } catch (e) {
        res.send({
           status: "warning",
           messages: e.messages
        });
    }
}

const setServers = async (req, res) => {
    const tagId = req.params.tagId;
    const serverIds = req.body.serverIds;
    try {
        const tag = await models.tag.findByPk(tagId);
        const newServers = await models.server.findAll({
            where: {
                id: serverIds
            }
        });
        tag.setServers(newServers);
        res.send({
            status: "success",
            messages: [{
                text: `Сервера успешно добавлены в тэг ${tag.name}!`
            }],
            tag: tag
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.message
        });
    }
}

const delete_tag = async (req, res) => {
    const tagId = req.params.tagId;
    try {
        const tag = await models.tag.findByPk(tagId);
        const tagName = tag.name;
        await tag.destroy();
        res.send({
            status: "success",
            tag: tagName
        });
    } catch {
        res.send({
            status: "warning",
            messages: e.message
        });
    }
}

module.exports = {
    create_tag,
    retrieveTagByIdName,
    edit_tag,
    setServers,
    delete_tag
}