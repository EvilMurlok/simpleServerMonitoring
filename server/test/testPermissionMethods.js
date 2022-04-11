const {models} = require("../sequelize");
const Op = require("sequelize");


const testPermissionMethods = async () => {
    let klim = null;
    try {
        klim = await models.user.registerUser({
            username: "klimonoid",
            phone: "+79859540479",
            email: "klim.fedorov2001@yandex.ru",
            password: "Limelime#100",
            confirm_password: "Limelime#100"
        });
    } catch (e) {
        klim = await models.user.findOne({
            where: {
                username: "klimonoid"
            }
        })
    }

    let nil = null;
    try {
        nil = await models.user.registerUser({
            username: "mrniletz",
            phone: "+79261221770",
            email: "nil.polsky2002@yandex.ru",
            password: "Limelime#6",
            confirm_password: "Limelime#6"
        });
    } catch (e) {
        nil = await models.user.findOne({
            where: {
                username: "mrniletz"
            }
        })
    }

    let klimProject = null;
    try {
        klimProject = await models.project.createProject({
            userId: klim.id,
            projectName: "alpha"
        });
    } catch (e) {
        klimProject = await models.project.findOne({
            where: {
                name: "alpha",
                userId: klim.id
            }
        });
    }

    let nilProject = null;
    try {
        nilProject = await models.project.createProject({
            userId: nil.id,
            projectName: "beta"
        });
    } catch (e) {
        nilProject = await models.project.findOne({
            where: {
                name: "beta",
                userId: nil.id
            }
        });
    }

    let klimPermission = null;
    try {
        klimPermission = await models.permission.createAdminPermission({
            project: klimProject
        });
    } catch (e) {
        klimPermission = await models.permission.findByProjectAndName({
            project: klimProject,
            name: 'admin'
        });
    }

    let nilPermission = null;
    try {
        nilPermission = await models.permission.createAdminPermission({
            project: nilProject
        });
    } catch (e) {
        nilPermission = await models.permission.findByProjectAndName({
            project: nilProject,
            name: 'admin'
        });
    }

    klim.addPermission(klimPermission);
    nil.addPermission(nilPermission);

    console.log("\n\n\n")
    console.log(klim.username);
    console.log(nil.username);
    console.log(klimProject.name);
    console.log(nilProject.name);
    console.log(klimPermission.id);
    console.log(nilPermission.id);

    let server1 = null;
    try {
        server1 = await models.server.createServer({
            projectId: klimProject.id,
            projectName: klimProject.name,
            hostname: "first",
            ip: "192.168.0.1"
        });
    } catch (e) {
        console.log(e);
        server1 = await models.server.retrieveProjectServerByHostname({
            hostname: "first",
            projectId: klimProject.id
        });
    }

    let server2 = null;
    try {
        server2 = await models.server.createServer({
            projectId: nilProject.id,
            projectName: nilProject.name,
            hostname: "second",
            ip: "192.168.0.2"
        });
    } catch (e) {
        server2 = await models.server.retrieveProjectServerByHostname({
            hostname: "second",
            projectId: nilProject.id
        });
    }

    let tag2 = null;
    try {
        tag2 = await models.tag.createWithName("forNil");
    } catch (e) {
        tag2 = await models.tag.findOneWithName("forNil");
    }

    await server2.addTag(tag2);

    // Что в итоге должно быть?
    // В праве клима должен быть добавлен server1, тк у него нет тега
    // В праве нила должен быть добавлен tag2, тк он назначен server2
    console.log(await server2.getTags());
    console.log(await tag2.getServers());
    console.log(tag2);
    console.log(server2);

    klimPermission = await models.permission.updateAdminPermission({
        project: klimProject
    });
    nilPermission = await models.permission.updateAdminPermission({
        project: nilProject
    });

    console.log(klimPermission);
    console.log(nilPermission);

    let abilities = [
        ...await models.ability.retrieveAllByEntityAction({
            entity: 'User',
            action: 'Retrieve'
        }),
        ...await models.ability.retrieveAllByEntityAction({
            entity:'Project',
            action: 'Retrieve'
        }),
        ...await models.ability.retrieveAllByEntityAction({
            entity:'Dashboard',
            action: 'Retrieve'
        }),
        ...await models.ability.retrieveAllByEntityAction({
            entity:'Permission',
            action: 'Retrieve'
        }),
        ...await models.ability.retrieveAllByEntityAction({
            entity:'Server',
            action: 'Retrieve'
        }),
        ...await models.ability.retrieveAllByEntityAction({
            entity:'Tag',
            action: 'Retrieve'
        }),
        ...await models.ability.retrieveAllByEntityAction({
            entity:'Metric',
            action: 'Retrieve'
        })
    ];

    let observerPermission = null;
    try {
        observerPermission = await models.permission.createCustomPermission({
            creator: nil,
            masterPermission: nilPermission,
            name: "observer",
            project: nilProject,
            abilities: abilities,
            tags: await models.tag.retrieveAllProjectTags(nilProject),
            users: [klim]
        });
    } catch (e) {
        observerPermission = await models.permission.findByProjectAndName({
            project: nilProject,
            name: 'observer'
        });
    }

    console.log(observerPermission);

    abilities = [
        ...await models.ability.retrieveAllByEntityAction({
            entity: 'User',
            action: 'Retrieve'
        }),
        ...await models.ability.retrieveAllByEntityAction({
            entity:'Project',
            action: 'Retrieve'
        }),
        ...await models.ability.retrieveAllByEntityAction({
            entity:'Server',
            action: 'Retrieve'
        }),
        ...await models.ability.retrieveAllByEntityAction({
            entity:'Tag',
            action: 'Retrieve'
        })
    ];

    await observerPermission.editPermission({
        editor: nil,
        masterPermission: nilPermission,
        name: "edited",
        project: nilProject,
        abilities: abilities,
        tags: await models.tag.retrieveAllProjectTags(nilProject),
        users: [nil, klim]
    });

    console.log(observerPermission);
}

const testGetSub = async () => {
    const permissionId = 49;
    try {
        const children = await models.permission.getSubPermissionsRecursive({permissionId: permissionId});
        console.log(children);
    } catch (e) {
        console.log(e);
    }
}


testGetSub().then();