function applyExtraSetup(sequelize) {
    const { server, user } = sequelize.models;

    user.hasMany(server);
    server.belongsTo(user);
}

module.exports = { applyExtraSetup };