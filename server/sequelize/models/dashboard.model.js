const {Model} = require("sequelize");

module.exports = class Dashboard extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            uid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        }, {
            modelName: 'dashboard',
            tableName: 'dashboard',
            paranoid: true,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
            deletedAt: 'deleted',
            sequelize: sequelize,
        });
    };

};