const {Model, DataTypes} = require("sequelize");

module.exports = (models) => {
    class Ability extends Model {
        static initModel(sequelize) {
            return super.init({
                bit: {
                    primaryKey: true,
                    allowNull: false,
                    unique: true,
                    type: DataTypes.STRING(34)
                },
                info: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    is: /^[a-zA-Z0-9_]{3,255}$/
                },
                json: {
                    type: DataTypes.JSON,
                    allowNull: true
                }
            }, {
                modelName: 'ability',
                tableName: 'Ability',
                paranoid: true,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                deletedAt: 'deleted',
                sequelize: sequelize,
            });
        };
    }
    return Ability;
};