const {models} = require("../sequelize");

const testServerMethods = async () => {
    let [projectId, hostname, ip] = [1, "server11", "101.5.40.1"];
    let currentServer = "";

    console.log("--------------------CREATION-----------------------");

    try {
        currentServer = await models.server.createServer({hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    try {
        currentServer = await models.server.createServer({projectId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    ip = "192.168.1.1";
    try {
        currentServer = await models.server.createServer({projectId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }
    hostname = "server12";
    ip = "192.168.1.50";
    try {
        currentServer = await models.server.createServer({projectId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    // with error
    try {
        currentServer = await models.server.createServer({projectId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    ip = "192.168.1.45";
    try {
        currentServer = await models.server.createServer({projectId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    projectId = 4;
    ip = "192.168.1.35";
    try {
        currentServer = await models.server.createServer({projectId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    hostname = "server42";
    ip = "192.168.1.25";
    try {
        currentServer = await models.server.createServer({projectId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }
    hostname = "server13";
    ip = "192.168.1.15";
    try {
        currentServer = await models.server.createServer({projectId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }
    hostname = "server14";
    ip = "192.168.1.05";
    try {
        currentServer = await models.server.createServer({projectId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    console.log("--------------------EDITION-----------------------");
    let serverId = 6
    projectId = 1;
    hostname = "server14";
    ip = "192.168.1.05";
    try {
        currentServer = await models.server.editServer({projectId, serverId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    serverId = 5
    projectId = 4;
    hostname = "server13";
    ip = "192.168.1.15";
    try {
        currentServer = await models.server.editServer({projectId, serverId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    hostname = "server131";
    ip = "192.168.1.05";
    try {
        currentServer = await models.server.editServer({projectId, serverId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    ip = "192.168.1.15";
    try {
        currentServer = await models.server.editServer({projectId, serverId, hostname, ip});
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    console.log("--------------------RETRIEVE-----------------------");
    try {
        console.log(await models.server.retrieveProjectServers({projectId}));
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    console.log("--------------------DELETION-----------------------");
    try {
        console.log(await models.server.deletionServer({projectId: 3}));
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }

    try {
        console.log(await models.server.deletionServer({serverId: 3}));
    } catch (e) {
        console.log(e.message);
        console.log(e.messages);
    }
}

testServerMethods().then();