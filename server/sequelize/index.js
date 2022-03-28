const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra_setup');

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


const modelDefiners = [
    require('./models/ability.model'),
    require('./models/dashboard.model'),
    require('./models/permission.model'),
    require('./models/project.model'),
    require('./models/user.model'),
    require('./models/server.model'),
    require('./models/server.model'),
    require('./models/tag.model'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;