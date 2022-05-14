const {models} = require("../../sequelize");

const create_admin_permission_with_project = async (req, res) => {
    const currentUserId = req.user.id;
    const projectId = req.params.projectId;
    try {
        const currentUser = await models.user.findByPk(currentUserId);
        const noAdminProject = await models.project.findByPk(projectId);
        const adminPermission = await models.permission.createAdminPermissionWithProject({project: noAdminProject});

        currentUser.addPermission(adminPermission);
        res.send({
            status: "success",
            messages: [{
                text: `В проекте ${noAdminProject.name} успешно создано Право администратора`
            }],
            permission: adminPermission
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const update_admin_permission_with_project = async (req, res) => {
    const projectId = req.params.projectId;
    try {
        const currentProject = await models.project.findByPk(projectId);
        const adminPermission = await models.permission.updateAdminPermission({project: currentProject});
        res.send({
            status: "success",
            messages: [{
                text: `В проекте ${currentProject.name} успешно обновлено Право администратора`
            }],
            permission: adminPermission
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const getAllCredentials = async ({
                                     currentUserId = null,
                                     projectId = null,
                                     masterPermissionId = null,
                                     abilityIds = [],
                                     tagIds = [],
                                     serverIds = [],
                                     userIds = []
                                 }) => {
    const currentUser = await models.user.findByPk(currentUserId);
    const masterPermission = await models.permission.findByPk(masterPermissionId);
    const currentProject = await models.project.findByPk(projectId);
    const abilitiesOfCustomPermission = await models.ability.findAll({
        where: {
            id: abilityIds
        }
    });

    // Getting all tag
    const tagsOfCustomPermission = await models.tag.findAll({
        where: {
            id: tagIds
        }
    });
    // Getting servers that don't overlap with tag
    const serversOfCustomPermission = await models.server.findAll({
        where: {
            id: serverIds,
        }
    });
    const usersOfCustomPermission = await models.user.findAll({
        where: {
            id: userIds
        }
    });

    return {
        currentUser: currentUser,
        masterPermission: masterPermission,
        currentProject: currentProject,
        abilitiesOfCustomPermission: abilitiesOfCustomPermission,
        tagsOfCustomPermission: tagsOfCustomPermission,
        serversOfCustomPermission: serversOfCustomPermission,
        usersOfCustomPermission: usersOfCustomPermission
    }
}

const create_custom_permission = async (req, res) => {
    const projectId = req.params.projectId;
    const currentUserId = req.user.id;
    const {masterPermissionId, name, abilityIds, tagIds, serverIds, userIds} = req.body;
    const messages = [];

    if (!userIds.length) {
        res.send({
            status: "warning",
            messages: [{text: "Выберите пользователей системы, которым Вы хотите присвоить создаваемое право!"}]
        });
    } else {
        try {
            const abilitiesOfCustomPermission = await models.ability.findAll({
                where: {id: abilityIds}
            });
            if ((tagIds.length && !(abilitiesOfCustomPermission.filter(ability => ability.entity === "Tag").length)) ||
                (serverIds.length && !(abilitiesOfCustomPermission.filter(ability => ability.entity === "Server").length))) {
                res.send({
                    status: "warning",
                    messages: [{
                        text: "У тегов, серверов необходимо указать хотя бы одно действие!"
                    }]
                });
            } else {
                if ((abilitiesOfCustomPermission.filter(ability => ability.entity === "Tag").length && !tagIds.length) ||
                    (abilitiesOfCustomPermission.filter(ability => ability.entity === "Server").length && !serverIds.length)) {
                    res.send({
                        status: "warning",
                        messages: [{
                            text: "Если выбрали действие, то укажите инстансы серверов или тегов, которым применяется действие!"
                        }]
                    });
                } else {
                    const currentUser = await models.user.findByPk(currentUserId);
                    const masterPermission = await models.permission.findByPk(masterPermissionId);
                    const currentProject = await models.project.findByPk(projectId);
                    const tagsOfCustomPermission = await models.tag.findAll({
                        where: {id: tagIds}
                    });
                    const serversOfCustomPermission = await models.server.findAll({
                        where: {id: serverIds}
                    });
                    const usersOfCustomPermission = await models.user.findAll({
                        where: {id: userIds}
                    });
                    const customPermission = await models.permission.createCustomPermission({
                        creator: currentUser,
                        masterPermission: masterPermission,
                        name: name,
                        project: currentProject,
                        abilities: abilitiesOfCustomPermission,
                        tags: tagsOfCustomPermission,
                        servers: serversOfCustomPermission,
                        users: usersOfCustomPermission,
                    });
                    res.send({
                        status: "success",
                        messages: [{
                            text: `В проекте ${currentProject.name} успешно создано Право ${customPermission.name}`
                        }],
                        permission: customPermission
                    });
                }
            }
        } catch (e) {
            res.send({
                status: "warning",
                message: e.message,
                messages: e.messages
            });
        }
    }
}

const edit_custom_permission = async (req, res) => {
    const permissionId = req.params.permissionId;
    const currentUserId = req.user.id;
    const {projectId, masterPermissionId, name, abilityIds, tagIds, serverIds, userIds} = req.body;
    try {
        const credentials = await getAllCredentials({
            currentUserId: currentUserId,
            projectId: projectId,
            masterPermissionId: masterPermissionId,
            abilityIds: abilityIds,
            tagIds: tagIds,
            serverIds: serverIds,
            userIds: userIds,
        });
        const permissionToEdit = await models.permission.findByPk(permissionId);
        await permissionToEdit.editPermission({
            editor: credentials.currentUser,
            masterPermission: credentials.masterPermission,
            name: name,
            project: credentials.currentProject,
            abilities: credentials.abilitiesOfCustomPermission,
            tags: credentials.tagsOfCustomPermission,
            servers: credentials.serversOfCustomPermission,
            users: credentials.usersOfCustomPermission,
        });
        res.send({
            status: "success",
            messages: [{
                text: `В проекте ${credentials.currentProject.name} успешно обновлено Право ${permissionToEdit.name}`
            }],
            permission: permissionToEdit
        });
    } catch (e) {
        res.send({
            status: "warning",
            message: e.message,
            messages: e.messages
        });
    }
}

const give_admin_permission_to_people = async (req, res) => {
    const [
        userIds,
        permissionAdminName
    ] = [
        req.body.userIds,
        req.body.permissionAdminName,
    ];
    try {
        await models.permission.giveAdminPermissionToPeople({permissionAdminName, userIds});
        res.send({
            status: "success",
            messages: [{
                text: `Право администратора ${permissionAdminName} успешно выдано пользователям!`
            }]
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieve_permissions_by_name = async (req, res) => {
    const [
        userId,
        permissionName
    ] = [
        req.user.id,
        req.query.permissionName
    ];
    const permissionsByName = await models.permission.retrievePermissionsByName({userId, permissionName});
    res.send({
        status: "success",
        permissionsByName: permissionsByName
    });
}

const retrieve_all_projects_user_permissions = async (req, res) => {
    const [
        userId,
        permissionName,
        projectName,
        serverHostname,
        serverIp,
        tagName,

    ] = [
        req.user.id,
        req.query.permissionName,
        req.query.projectName,
        req.query.filterHostname,
        req.query.filterIp,
        req.query.filterTag,
    ];
    let [
        actions,
        entities
    ] = [
        req.query.actions,
        req.query.entities
    ];
    if (typeof entities === "string") {
        entities = [entities];
    }
    if (typeof actions === "string") {
        actions = [actions];
    }
    let userAllProjectsPermissions = await models.permission.retrieveAllUserProjectsPermissions({
        userId,
        permissionName,
        projectName,
        entities,
        actions,
        serverHostname,
        serverIp,
        tagName
    });
    if (userAllProjectsPermissions && userAllProjectsPermissions.length) {
        console.log("QQQQ");
    } else {
        userAllProjectsPermissions = [];
    }
    res.send({
        status: "success",
        userAllProjectsPermissions: userAllProjectsPermissions
    });
}

const retrieve_project_user_permissions = async (req, res) => {
    const [userId, projectId] = [req.user.id, req.params.projectId];
    res.send({
        status: "success",
        projectUserPermissions: await models.permission.retrieveProjectUserPermissions({userId, projectId})
    });
}

const retrieve_permissions_with_items = async (req, res) => {
    const permissionId = req.params.permissionId;
    res.send({
        status: "success",
        permissionWithItems: await models.permission.retrievePermissionWithItems({permissionId})
    });
}

const retrieve_common_user_permissions = async (req, res) => {
    const userId = req.user.id;
    let userAllCommonPermissions = await models.permission.retrieveCommonUserPermissions({userId: userId});
    if (userAllCommonPermissions && userAllCommonPermissions.length) {
        console.log("QQQQ");
    } else {
        userAllCommonPermissions = [];
    }
    res.send({
        status: "success",
        userAllCommonPermissions: userAllCommonPermissions
    });
}

const get_sub_permissions = async (req, res) => {
    const permissionId = req.params.permissionId;
    try {
        const permission = await models.permission.findByPk(permissionId);
        const children = await permission.getChildrenPermissions();
        res.send({
            status: "success",
            messages: [{
                text: `Вот список дочерних Прав!`
            }],
            permissions: children
        });
    } catch (e) {
        res.send({
            status: "warning",
            message: e.message,
            messages: e.messages
        });
    }
}

const get_parent_permissions = async (req, res) => {
    const permissionId = req.params.permissionId;
    try {
        const permission = await models.permission.findByPk(permissionId);
        console.log(permissionId);
        console.log(permission);
        const parents = await permission.getParentPermissions();
        res.send({
            status: "success",
            messages: [{
                text: `Вот список родительских Прав!`
            }],
            permissions: parents
        });
    } catch (e) {
        res.send({
            status: "warning",
            message: e.message,
            messages: e.messages
        });
    }
}

const delete_permission = async (req, res) => {
    const permissionId = req.params.permissionId;
    const cascade = req.params.cascade;
    try {
        const permission = await models.permission.findByPk(permissionId);
        await permission.deletePermission({cascade});
        if (cascade) {
            res.send({
                messages: [{
                    text: `Право и его дочерние Права успешно удалены!`
                }]
            });
        }
        res.send({
            messages: [{
                text: `Право успешно удалено!`
            }]
        });
    } catch (e) {
        res.send({
            status: "warning",
            message: e.message,
            messages: e.messages
        });
    }
}

module.exports = {
    create_admin_permission_with_project,
    update_admin_permission_with_project,
    create_custom_permission,
    edit_custom_permission,
    give_admin_permission_to_people,
    retrieve_permissions_by_name,
    retrieve_all_projects_user_permissions,
    retrieve_project_user_permissions,
    retrieve_permissions_with_items,
    retrieve_common_user_permissions,
    get_parent_permissions,
    get_sub_permissions,
    delete_permission
}