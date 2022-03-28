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
                is: /^[a-zA-Z0-9_]{3,255}$/
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                is: /^[a-zA-Z0-9_-]+/
            }
        },
    );
};