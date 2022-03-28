const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define(
        'metadata', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                is: /^[+]*[0-9]{0,3}[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
            },
            mail: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                is: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            },
            grafana_username: {
                type: DataTypes.STRING,
                unique: true,
                is: /^[a-zA-Z0-9_]{5,255}$/
            }
        },
    );
};