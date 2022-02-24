const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'user', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            username: {
                type: DataTypes.STRING(70),
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            passwordCookieToken: {
                type: DataTypes.STRING,
            }
        },
    );
};