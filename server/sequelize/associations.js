module.exports = function (sequelize) {
    const {server, user, permission, project, tag, ability, dashboard} = sequelize.models;
    user.hasMany(project);
    project.belongsTo(user);
    user.belongsToMany(permission, {through: 'UserPermission'})
    permission.belongsToMany(user, {through: 'UserPermission'})
    user.hasMany(dashboard);
    dashboard.belongsTo(user);

    project.hasMany(server);
    server.belongsTo(project);
    project.belongsToMany(permission, {through: "ProjectPermission"});
    permission.belongsToMany(project, {through: "ProjectPermission"});

    server.belongsToMany(permission, {through: 'ServerPermission'});
    permission.belongsToMany(server, {through: 'ServerPermission'});
    server.belongsToMany(tag, {through: 'ServerTag'});
    tag.belongsToMany(server, {through: 'ServerTag'});

    permission.belongsToMany(tag, {through: 'PermissionTag'});
    tag.belongsToMany(permission, {through: 'PermissionTag'});

    permission.hasMany(permission);
    permission.belongsTo(permission);
    permission.hasMany(dashboard);
    dashboard.belongsTo(permission);

    permission.belongsToMany(ability, {through: 'AbilityPermission'});
    ability.belongsToMany(permission, {through: 'AbilityPermission'});
}
