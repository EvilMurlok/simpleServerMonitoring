const dbConfig = require('./config/config.db.js');
const Sequelize = require('sequelize');


const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
    }
);

const User = sequelize.define(
    'User', {
        username: {
            type: Sequelize.STRING(70),
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        passwordCookieToken: {
            type: Sequelize.STRING,
        }
    }, {
        sequelize,
        modelName: 'User',
    }
);

const Server = sequelize.define(
    'Server', {
        userId: {
            type: Sequelize.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
            allowNull: false,
        },
        hostname: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        status: {
            type: Sequelize.ENUM('on', 'off'),
            allowNull: false,
        },
        CPU_number: {
            type: Sequelize.INTEGER,
        },
        CPU_load: {
            type: Sequelize.DOUBLE,
        },
        memory_load: {
            type: Sequelize.DOUBLE,
        },
        memory_usage: {
            type: Sequelize.DOUBLE,
        },
        requests_amount: {
            type: Sequelize.INTEGER,
        },
        latency: {
            type: Sequelize.DOUBLE,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: 'Server',
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {
    sequelize: sequelize,
    User: User,
    Server: Server
};




