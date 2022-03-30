const {Model} = require("sequelize");

module.exports = class Permission extends Model {
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
            end_of_life: {
                type: DataTypes.DATE,
            }
        }, {
            modelName: 'permission',
            tableName: 'permission',
            paranoid: true,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
            deletedAt: 'deleted',
            sequelize: sequelize,
        });
    };

};