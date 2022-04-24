const {Model, DataTypes, Op} = require("sequelize");
const {
    PermissionCredentialsError, PermissionSameCredentialsError,
    PermissionNotFoundError, PermissionCommonError,
    PermissionTransactionError
} = require("../errors/permission/permissionErrors");


module.exports = (sequelize) => {
    class Permission extends Model {
        static initModel(sequelize) {
            return super.init({
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER
                },
                // must be unique inside of one project
                name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                end_of_life: {
                    type: DataTypes.DATE,
                    allowNull: true
                }
            }, {
                modelName: 'permission',
                tableName: 'Permission',
                paranoid: true,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                deletedAt: 'deleted',
                sequelize: sequelize,
            });
        };

        static #validateName = ({name = ""}) => {
            let messages = [];
            const rightName = /^[a-zA-Z0-9_]{3,255}$/;

            if (!name) {
                messages.push(
                    {
                        text: "Право должно иметь имя!"
                    }
                );
            }
            if (name && !rightName.test(name)) {
                messages.push(
                    {
                        text: "Имя Права может содержать только латинские буквы, цифры, подчёркивания и чёрточки!"
                    }
                );
            }
            return messages;
        }

        static #validateDate = ({date = null}) => {
            let messages = [];

            if (date) {
                if (date < Date.now()) {
                    messages.push({
                        text: "Дата окончания права не может быть в прошлом!"
                    });
                }
            }
            return messages;
        }

        static #validateData = ({name = "", date = null}) => {
            let messages = [
                ...Permission.#validateName({name: name}),
                ...Permission.#validateDate({date: date})
            ]

            if (messages.length > 0) {
                throw new PermissionCredentialsError("Invalid data for Permission!", messages);
            }
        }

        static #validateSameDefaultData = async () => {
            const currentDefaultPermission = await sequelize.models.permission.findOne({
                where: {
                    name: "default"
                }
            });
            if (currentDefaultPermission) {
                throw new PermissionSameCredentialsError("Default permission already exists!", [{
                    text: "Право по умолчанию уже существует!"
                }]);
            }
        }

        static #validateSameDataWithProject = async ({name = "", project = null, selfId = null}) => {
            if (!project) {
                throw new PermissionCredentialsError(
                    "Invalid credentials for Permission",
                    [{
                        text: "Необходимо указать проект, с которым связано Право!"
                    }]
                );
            }

            let sameNamePermission = null;

            if (selfId) {
                // If you call this method from instance and don't want to change name
                sameNamePermission = await project.getPermissions({
                    where: {
                        name: name,
                        id: {
                            [Op.ne]: selfId
                        }
                    }
                });
            } else {
                sameNamePermission = await project.getPermissions({
                    where: {
                        name: name
                    }
                });
            }

            if (sameNamePermission.length > 0) {
                throw new PermissionSameCredentialsError(
                    "Same name for permission",
                    [{
                        text: `Внутри этого проекта ${project.name} уже есть право с таким именем!`
                    }]
                );
            }
        }

        static #getTagsAndServersOfProject = async (servers) => {
            let tagIds = new Set();
            let resServers = [];
            for (let server of servers) {

                const serverTags = await server.getTags();

                if (serverTags.length <= 0) {
                    resServers.push(server);
                } else {
                    for (let tag of serverTags) {
                        tagIds.add(tag.id);
                    }
                }
            }
            console.log(Array.from(tagIds));
            const tags = await sequelize.models.tag.findAll({
                where: {
                    id: Array.from(tagIds)
                }
            });

            return {
                tags: tags,
                servers: resServers
            };
        }

        static #credentialsValidation = async ({
                                                   selfId = null,
                                                   user = null,
                                                   masterPermission = null,
                                                   name = "",
                                                   project = null,
                                                   abilities = []
                                               }) => {
            try {
                await Permission.#validateData({name: name});
                await Permission.#validateSameDataWithProject({name: name, project: project, selfId: selfId});
            } catch (e) {
                throw e;
            }

            let messages = [];

            if (!user) {
                messages.push({
                    text: "Нельзя создать Право без указания создателя!"
                });
            }

            if (!masterPermission) {
                messages.push({
                    text: "Для создания нового Права необходимо указать родительское!"
                });
            }

            if (!await project.hasPermission(masterPermission)) {
                messages.push({
                    text: "Базовое правило не принадлежит проекту!"
                });
            }

            if (!await user.hasPermission(masterPermission)) {
                messages.push({
                    text: "Создатель не имеет родительского Права!"
                });
            }

            for (let ability of abilities) {
                if (!await masterPermission.hasAbility(ability)) {
                    messages.push({
                        text: `Невозможно создать Право с Возможностью ${ability.name}` +
                            `так как его нет у родительского Права`
                    });
                }
            }

            return messages;
        }

        static findByProjectAndName = async ({project = null, name = ""}) => {
            try {
                Permission.#validateName({name});
            } catch (e) {
                throw e;
            }

            return await Permission.findOne({
                where: {
                    name: name,
                    projectId: project.id
                }
            })
        }

        static createDefaultPermission = async () => {
            try {
                await this.#validateSameDefaultData();
            } catch (e) {
                console.error(e.message);
                return;
            }
            const availableAbilities = await sequelize.models.ability.findAll({
                where: {
                    [Op.or]: [
                        {
                            [Op.and]: [
                                {
                                    entity: "User",
                                },
                                {
                                    detail: "Self",
                                }
                            ]
                        },
                        {
                            entity: "Project",
                            action: {
                                [Op.in]: ["Create", "Retrieve"]
                            }
                        }
                    ]
                }
            });
            const t = await sequelize.transaction();
            try {
                const defaultPermission = await sequelize.models.permission.create({
                    name: "default"
                });
                await defaultPermission.setAbilities(availableAbilities, {transaction: t});
                await t.commit();
            } catch (e) {
                console.error(e);
                await t.rollback();
            }
        }

        // can do anything in the project
        static createAdminPermissionWithProject = async ({project = null}, transaction) => {
            console.log(`\n\n\n\n${project.name}\n\n\n\n`);
            try {
                await Permission.#validateSameDataWithProject({name: `admin${project.name}`, project: project});
            } catch (e) {
                throw e;
            }
            const adminAbilities = await sequelize.models.ability.findAll({
                where: {

                    [Op.or]: [
                        {
                            entity: {
                                [Op.in]: ["Dashboard", "Permission", "Server", "Tag", "Metric"]
                            }
                        },
                        {
                            [Op.and]: [
                                {
                                    entity: "Project"
                                },
                                {
                                    action: {
                                        [Op.in]: ["Update", "Delete"]
                                    }
                                }
                            ]
                        }
                    ]
                }
            }, {transaction: transaction});
            try {
                const adminProjectPermission = await this.create({
                    name: `admin${project.name}`,
                }, {transaction: transaction});

                await adminProjectPermission.addAbilities(adminAbilities, {transaction: transaction});

                await adminProjectPermission.setProject(project, {transaction: transaction});

                const servers = await project.getServers();

                const toAdd = await this.#getTagsAndServersOfProject(servers);

                if (toAdd.tags.length > 0) {
                    await adminProjectPermission.addTags(toAdd.tags, {transaction: transaction});
                }
                if (toAdd.servers.length > 0) {
                    await adminProjectPermission.addServers(toAdd.servers, {transaction: transaction});
                }
                return adminProjectPermission;
            } catch (e) {
                console.log(e);
                throw new PermissionTransactionError("An error occurred during the transaction", [{text: "Ошибка при создании права администратора на проект!"}]);
            }


            // let a = [
            //     ...await sequelize.models.ability.retrieveAllByEntityDetail({
            //         entity: "User",
            //         detail: "Self"
            //     }),
            //     ...await sequelize.models.ability.retrieveAllByEntity({
            //         entity: "Project"
            //     }),
            //     ...await sequelize.models.ability.retrieveAllByEntity({
            //         entity: "Dashboard"
            //     }),
            //     ...await sequelize.models.ability.retrieveAllByEntity({
            //         entity: "Permission"
            //     }),
            //     ...await sequelize.models.ability.retrieveAllByEntity({
            //         entity: "Server"
            //     }),
            //     ...await sequelize.models.ability.retrieveAllByEntity({
            //         entity: "Tag"
            //     }),
            //     ...await sequelize.models.ability.retrieveAllByEntity({
            //         entity: "Metric"
            //     }),
            // ];


        }

        static updateAdminPermission = async ({project = null}) => {
            const adminPermission = await this.findByProjectAndName({
                project: project,
                name: "admin"
            });

            const servers = await project.getServers();

            const toSet = await this.#getTagsAndServersOfProject(servers);
            await adminPermission.setTags(toSet.tags);
            await adminPermission.setServers(toSet.servers);

            return adminPermission;
        }

        static createCustomPermission = async ({
                                                   creator = null,
                                                   masterPermission = null,
                                                   name = "",
                                                   project = null,
                                                   abilities = [],
                                                   tags = [],
                                                   servers = [],
                                                   users = []
                                               }) => {
            console.log({creator, masterPermission, name, project, abilities, tags, servers, users})
            let messages = await this.#credentialsValidation({
                user: creator,
                masterPermission: masterPermission,
                name: name,
                project: project,
                abilities: abilities
            });

            if (messages.length > 0) {
                throw new PermissionCredentialsError(
                    "Invalid credentials for Permission creation",
                    messages
                );
            }

            const customPermission = await this.create({
                name: name,
                permissionId: masterPermission.id,
                projectId: project.id
            });

            await customPermission.addAbilities(abilities);

            if (tags.length > 0) {
                await customPermission.addTags(tags);
            }

            if (servers.length > 0) {
                await customPermission.addServers(servers);
            }

            if (users.length > 0) {
                await customPermission.addUsers(users);
            }

            return customPermission;
        }

        editPermission = async ({
                                    editor = null,
                                    masterPermission = null,
                                    name = "",
                                    project = null,
                                    abilities = [],
                                    tags = [],
                                    servers = [],
                                    users = []
                                }) => {
            let messages = await Permission.#credentialsValidation({
                selfId: this.id,
                user: editor,
                masterPermission: masterPermission,
                name: name,
                project: project,
                abilities: abilities,
                tags: tags,
                servers: servers,
                users: users
            });

            if (messages.length > 0) {
                throw new PermissionCredentialsError(
                    "Invalid credentials for Permission creation",
                    messages
                );
            }

            this.setProject(project);
            this.setPermission(masterPermission);
            this.name = name;

            await this.setAbilities(abilities);

            if (tags.length > 0) {
                await this.setTags(tags);
            }

            if (servers.length > 0) {
                await this.setServers(servers);
            }

            if (users.length > 0) {
                await this.setUsers(users);
            }

            return this;
        }

        static retrievePermissionsByName = async ({userId = 0, permissionName = "%"}) => {
            const currentUserWithFoundPermissions = await sequelize.models.user.findAll({
                where: {id: userId},
                include: {
                    model: sequelize.models.permission,
                    required: true,
                    attributes: ["name"],
                    where: {
                        projectId: {
                            [Op.not]: null
                        },
                        name: {
                            [Op.iLike]: `%${permissionName}%`
                        }
                    },
                    through: {attributes: []}
                }
            });
            if (currentUserWithFoundPermissions.length) {
                return currentUserWithFoundPermissions[0].permissions.map(permission => permission.name);
            } else {
                return [];
            }
        }

        static retrieveCommonUserPermissions = async ({userId = 0}) => {
            const currentUserWithCommonPermissions = await sequelize.models.user.findAll({
                where: {id: userId},
                include: {
                    model: sequelize.models.permission,
                    required: true,
                    attributes: ["id", "name"],
                    through: {attributes: []},
                    where: {
                        projectId: {
                            [Op.is]: null
                        }
                    },
                    include: {
                        model: sequelize.models.ability,
                        required: true,
                        attributes: ["id", "entity", "action", "detail"],
                        through: {attributes: []}
                    }
                },
                order: [[sequelize.models.permission, "name", "ASC"]]

            });
            if (currentUserWithCommonPermissions.length) {
                return currentUserWithCommonPermissions[0].permissions;
            } else {
                return [];
            }
        }

        static retrieveAllUserProjectsPermissions = async ({
                                                               userId = 0,
                                                               permissionName = "%",
                                                               projectName = "%",
                                                               entities = ["Server", "Tag", "Dashboard", "Permission", "Project"],
                                                               actions = ["Create", "Retrieve", "Update", "Delete"],
                                                               serverHostname = "%",
                                                               serverIp = "%",
                                                               tagName = "%",
                                                           }, isFilterServer = false, isFilterTag = false) => {
            const currentUserWithProjectsPermissions = await sequelize.models.user.findAll({
                where: {id: userId},
                include: {
                    model: sequelize.models.permission,
                    required: true,
                    attributes: ["id", "name"],
                    through: {attributes: []},
                    where: {
                        projectId: {
                            [Op.not]: null
                        },
                        name: {
                            [Op.iLike]: `%${permissionName}%`
                        }
                    },
                    include:
                        [
                            {
                                model: sequelize.models.user,
                                required: false,
                                attributes: ["id", "username", "email", "phone"],
                                through: {attributes: []}
                            },
                            {
                                model: sequelize.models.ability,
                                required: true,
                                attributes: ["id", "entity", "action", "detail"],
                                through: {attributes: []},
                                where: {
                                    entity: {
                                        [Op.in]: entities
                                    },
                                    action: {
                                        [Op.in]: actions
                                    }
                                }
                            },

                            {
                                model: sequelize.models.project,
                                required: true,
                                attributes: ["id", "name"],
                                where: {
                                    name: {
                                        [Op.iLike]: `%${projectName}%`
                                    }
                                }
                            },

                            {
                                model: sequelize.models.server,
                                required: isFilterServer,
                                attributes: ["id", "hostname", "ip"],
                                through: {attributes: []},
                                where: {
                                    hostname: {
                                        [Op.iLike]: `%${serverHostname}%`
                                    },
                                    ip: {
                                        [Op.iLike]: `%${serverIp}%`
                                    }
                                }
                            },
                            {
                                model: sequelize.models.tag,
                                required: isFilterTag,
                                attributes: ["id", "name", "color"],
                                through: {attributes: []},
                                where: {
                                    name: {
                                        [Op.iLike]: `%${tagName}%`
                                    }
                                }
                            },
                        ]
                },
                order: [[sequelize.models.permission, "name", "ASC"]]
            });
            if (currentUserWithProjectsPermissions.length) {
                return currentUserWithProjectsPermissions[0].permissions;
            } else {
                return [];
            }
        }

        static retrieveProjectPermission = async ({permissionId = 0, projectId = 0}) => {
            const permission = await this.findOne({
                where: {
                    id: permissionId,
                    projectId: projectId
                }
            });
            if (permission) {
                return permission;
            }
            throw new PermissionNotFoundError("Such permission not found!", [{
                text: "В данном Проекте такого Права не найдено!"
            }]);
        }

        static retrieveProjectPermissionByName = async ({name = "", projectId = 0}) => {
            const permission = await this.findOne({
                where: {
                    name: name,
                    projectId: projectId
                }
            });
            if (permission) {
                return permission;
            }
            throw new PermissionNotFoundError("Such permission not found!", [{
                text: "В данном Проекте такого Права не найдено!"
            }]);
        }

        getSubPermissions = async () => {
            let res = await this.getLinkedPermissionsRecursive();
            res.splice(0, 1);
            return res;
        }

        getLinkedPermissionsRecursive = async () => {
            let sub = [];

            let children = await sequelize.models.permission.findAll({
                where: {
                    permissionId: this.id
                },
            });

            if (children.length > 0) {
                sub.push(this);
                for (let child of children) {
                    sub.push(...await child.getLinkedPermissionsRecursive());
                }
            } else {
                sub.push(this);
            }
            return sub;
        };

        deletePermission = async ({cascade = false}) => {
            if (this.name === "admin") {
                throw new PermissionCommonError(
                    "You can't delete admin permission",
                    [{
                        text: "Вы не можете удалить Право администратора"
                    }]
                );
            }
            if (cascade) {
                let children = this.getSubPermissions();
                (await children).forEach(child => {
                    child.destroy();
                });
            }

            await this.destroy();
        }
    }

    return Permission;
}