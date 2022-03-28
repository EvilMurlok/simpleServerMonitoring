const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'project', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                is: /^[a-zA-Z0-9_]{3,255}$/
            },
        },
    );
};