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
                unique: true,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('on', 'off'),
                defaultValue: 'on',
                allowNull: false,
            },
            CPU_number: {
                type: DataTypes.INTEGER,
            },
            CPU_load: {
                type: DataTypes.DOUBLE,
            },
            memory_load: {
                type: DataTypes.DOUBLE,
            },
            memory_usage: {
                type: DataTypes.DOUBLE,
            },
            requests_amount: {
                type: DataTypes.INTEGER,
            },
            latency: {
                type: DataTypes.DOUBLE,
            },
        },
    );
};