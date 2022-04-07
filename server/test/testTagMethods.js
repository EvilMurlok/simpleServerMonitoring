const {models} = require("../sequelize");

const testTagMethods = async () => {
    let server1 = await models.server.create({
        hostname: "alpha",
        ip: "192.168.0.1"
    })

    let server2 = await models.server.create({
        hostname: "beta",
        ip: "192.168.0.2"
    })

    let superTag = await models.tag.findOneOrCreateWithName("super");
    let puperTag = await models.tag.findOneOrCreateWithName("puper");
    let willBeDeleted = await models.tag.findOneOrCreateWithName("willBeDeleted");

    await superTag.addServer(server1);
    await puperTag.addServer(server2);

    let someTag = models.tag.findOneWithName("super");

    let callAnErrorOne = null;

    try {
        callAnErrorOne = await models.tag.createWithName("Я обязательно вызову ошибку");
    } catch (e) {
        console.log(e.messages);
    }

    await superTag.mergeWith(puperTag);
    await puperTag.editWithValidation("superPuper");
    await willBeDeleted.destroyIfNotUsed();
}

testTagMethods().then();