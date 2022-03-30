const {Model} = require("sequelize");

module.exports = class Ability extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
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
        }, {
            modelName: 'ability',
            tableName: 'ability',
            paranoid: true,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
            deletedAt: 'deleted',
            sequelize: sequelize,
        });
    };

};