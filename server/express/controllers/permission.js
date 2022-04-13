const {models} = require("../../sequelize");
const {Op} = require("sequelize");


const create_admin_permission = async (req, res) => {
    const currentUserId = req.user.id;
    const projectId = req.params.projectId;
    try {
        const currentUser = await models.user.findByPk(currentUserId);
        const noAdminProject = await models.project.findByPk(projectId);
        const adminPermission = await models.permission.createAdminPermission({project: noAdminProject});

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

const update_admin_permission = async (req, res) => {
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
                                     serverIds =[],
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
        },
        include: {
            model: models.tag,
            where: {
                id: {
                    [Op.notIn]: tagIds
                }
            }
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
        console.log(credentials);
        const customPermission = await models.permission.createCustomPermission({
            creator: credentials.currentUser,
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
                text: `В проекте ${credentials.currentProject.name} успешно создано Право ${customPermission.name}`
            }],
            permission: customPermission
        });
    } catch (e) {
        res.send({
            status: "warning",
            message: e.message,
            messages: e.messages
        });
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

const retrieve_project_permissions = async (req, res) => {
    const permissionId = req.params.permissionId;
    try {
        const projectPermissions = await models.permission.retrieveProjectPermissions({permissionId});
        res.send({
            status: "success",
            servers: projectPermissions
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const retrieve_server_in_project = async (req, res) => {
    const [permissionId, projectId] = [req.params.permissionId, req.params.projectId];
    try {
        const projectPermission = await models.permission.retrieveProjectPermission({permissionId, projectId});
        res.send({
            status: "success",
            projectServer: projectPermission
        })
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const get_sub_permissions = async (req, res) => {
    const permissionId = req.params.permissionId;
    try {
        const permission = await models.permission.findByPk(permissionId);
        const children = await permission.getSubPermissions();
        res.send({
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
    create_admin_permission,
    update_admin_permission,
    create_custom_permission,
    edit_custom_permission,
    get_sub_permissions,
    delete_permission
}