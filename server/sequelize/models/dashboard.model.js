const {Model, DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    class Dashboard extends Model {
        static initModel(sequelize) {
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
                configuration: {
                    type: DataTypes.JSON,
                    allowNull: true
                }
            }, {
                modelName: 'dashboard',
                tableName: 'Dashboard',
                paranoid: true,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                deletedAt: 'deleted',
                sequelize: sequelize,
            });
        };
    }
    return Dashboard;
};