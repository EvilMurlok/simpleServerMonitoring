const {models} = require("../sequelize");

const testAbilityMethods = async () => {
    let output = [];

    let res = null;

    res = await models.ability.retrieveAllByEntity({
        entity: 'Project',
    });

    output.push(...res);

    res = await models.ability.retrieveAllByEntityAction({
        entity: 'Metric',
        action: 'Update',
    });

    output.push(...res);

    res = await models.ability.retrieveAllByEntityDetail({
        entity: 'Metric',
        detail: 'Application',
    });

    output.push(...res);

    res = await models.ability.retrieveSpecificOne({
        entity: 'Project',
        action: 'Create',
    });

    output.push(res);

    res = await models.ability.retrieveSpecificOne({
        entity: 'Metric',
        action: 'Retrieve',
        detail: 'Hardware',
    });

    output.push(res);

    for (let ability of output) {
        console.log(ability.name);
    }

}

testAbilityMethods().then();