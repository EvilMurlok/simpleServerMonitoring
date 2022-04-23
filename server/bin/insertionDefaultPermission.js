const {models} = require("../sequelize");

async function insertDefaultPermission() {
    await models.permission.createDefaultPermission();
}

insertDefaultPermission().then();