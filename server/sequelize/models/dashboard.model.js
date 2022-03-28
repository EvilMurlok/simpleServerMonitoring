const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'dashboard', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            uid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
    );
};