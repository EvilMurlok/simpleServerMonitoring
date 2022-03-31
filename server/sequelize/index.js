const { Sequelize } = require('sequelize');

const dbConfig = require('../config/config.db.js');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: dbConfig.dialect,
    },
);

const models = {
    user: require('../sequelize/models/user.model'),
    ability: require('./models/ability.model'),
    dashboard: require('./models/dashboard.model'),
    permission: require('./models/permission.model'),
    project: require('./models/project.model'),
    server: require('./models/server.model'),
    tag: require('./models/tag.model')
}

for (const model in models) {
    const myModel = models[model](sequelize.models);
    myModel.initModel(sequelize);
}

let associations = require('./associations');

associations(sequelize);

module.exports = sequelize;