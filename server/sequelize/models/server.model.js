const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'server', {
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
        },
    );
};