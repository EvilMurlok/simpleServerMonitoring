const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'user', {
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