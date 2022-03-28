const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'tag', {
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

        },
    );
};