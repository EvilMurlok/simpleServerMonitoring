const { models } = require("../sequelize");
const getPassword = require("../express/ulils/utils");
async function insertion(){
    await models.user.create({ username: "IlyaPanin",  password: getPassword("qwerty123") });
    await models.user.create({ username: "Anna",  password: getPassword("qwerty123") });
    await models.user.create({ username: "Denis",  password: getPassword("qwerty123") });
}

insertion().then();