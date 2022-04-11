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

    let superTag = await models.tag.createWithName({tagName: "super"});
    let puperTag = await models.tag.createWithName({tagName:"puper"});
    let willBeDeleted = await models.tag.createWithName({tagName:"willBeDeleted"});

    await superTag.addServer(server1);
    await puperTag.addServer(server2);

    let someTag = models.tag.findOneWithName({tagName:"super"});

    let callAnErrorOne = null;

    try {
        callAnErrorOne = await models.tag.createWithName({tagName:"Я обязательно вызову ошибку"});
    } catch (e) {
        console.log(e.messages);
    }

    await superTag.mergeWith({tag: puperTag});
    await puperTag.editWithValidation({tagName: "superPuper"});
    await willBeDeleted.destroyIfNotUsed();
}

testTagMethods().then();