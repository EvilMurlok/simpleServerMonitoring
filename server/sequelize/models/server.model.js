const {Model} = require("sequelize");

module.exports = class Server extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            hostname: {
                type: DataTypes.STRING,
                allowNull: false,
                is: /^[a-zA-Z0-9_]{3,255}$/
            },
            ip: {
                type: DataTypes.STRING,
                allowNull: false,
                is: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
            },
        }, {
            modelName: 'server',
            tableName: 'server',
            paranoid: true,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
            deletedAt: 'deleted',
            sequelize: sequelize,
        });
    };

    static createServer = async ({hostname = "", ip = ""}, models) => {
        if (hostname && ip) {

        }
        return {
            status: "danger",

        }
    }
};