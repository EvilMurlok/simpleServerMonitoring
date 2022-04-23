const {models} = require("../sequelize");
const abilities = require("./abilities.json");

async function insertAbilities() {
    console.log(abilities);
    await models.ability.bulkCreate(abilities.abilities);
}

insertAbilities().then();