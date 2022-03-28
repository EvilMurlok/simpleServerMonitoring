const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'permission', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                is: /^[a-zA-Z0-9_]{3,255}$/
            },
            end_of_life: {
                type: DataTypes.DATE,
            }
        },
    );
};