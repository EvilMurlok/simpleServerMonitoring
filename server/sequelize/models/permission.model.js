const {Model, DataTypes} = require("sequelize");

module.exports = (models) => {
    class Permission extends Model {
        static initModel(sequelize) {
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
                tableName: 'Permission',
                paranoid: false,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                sequelize: sequelize,
            });
        };
    }
    return Permission;
};