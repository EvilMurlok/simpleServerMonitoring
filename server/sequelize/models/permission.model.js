const {Model, DataTypes, Op} = require("sequelize");
const {
    PermissionCredentialsError,
    PermissionSameCredentialsError, PermissionNotFoundError,
} = require("../errors/permission/permissionErrors");
const {ServerCommonError, ServerNotFoundError} = require("../errors/server/serverException");


module.exports = (models) => {
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

        static #validateName = async ({name = null}) => {
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

        static #validateDate = async ({date = null}) => {
            let messages = [];

            if (date) {
                if (date > Date.now()) {
                    messages.push({
                        text: "Дата окончания прва не может быть в прошлом!"
                    });
                }
            }
            return messages;
        }

        static #validateData = async ({name = "", date = null}) => {
            console.log(name);
            console.log(date);
            let messages = [
                ...await Permission.#validateName({name: name}),
                ...await Permission.#validateDate({date: date})
            ]

            if (messages.length > 0) {
                throw new PermissionCredentialsError("Invalid data for Permission!", messages);
            }
        }

        static #validateSameData = async ({name = "", project = null, selfId = null}) => {
            if (!project) {
                throw new PermissionCredentialsError(
                    "Invalid credentials for Permission",
                    [{
                        text: "Необходимо указать проект, с которым связано Право!"
                    }]
                );
            }

            let sameNamePermission = null;

            if (selfId != null) {
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

        static findByProjectAndName = async ({project = null, name = ""}) => {
            try {
                await Permission.#validateName(name);
            } catch (e) {
                throw e;
            }

            return Permission.findOne({
                where: {
                    name: name,
                    projectId: project.id
                }
            })
        }

        //TODO move to project model
        static #getTagsAndServersOfProject = async (servers) => {
            let tagIds = new Set;
            let resServers = [];
            for (let server of servers) {

                const serverTags = await server.getTags();

                if (serverTags.length <= 0) {
                    resServers.push(server);
                } else {
                    let ids = [];
                    for (let server of serverTags) {
                        ids.push(server.id);
                    }

                    tagIds.add(...ids);
                }

            }

            const tags = await models.tag.findAll({
                where: {
                    id: Array.from(tagIds)
                }
            });

            return {
                tags: tags,
                servers: resServers
            };
        }

        // can do anything in the project
        static createAdminPermission = async ({project = null}) => {
            console.log(`\n\n\n\n${project.name}\n\n\n\n`);
            try {
                await Permission.#validateSameData({name: 'admin', project: project});
            } catch (e) {
                throw e;
            }

            const adminPermission = await this.create({
                name: `admin`,
            });

            const adminAbilities = [
                ...await models.ability.retrieveAllByEntity({
                    entity: 'User'
                }),
                ...await models.ability.retrieveAllByEntity({
                    entity: 'Project'
                }),
                ...await models.ability.retrieveAllByEntity({
                    entity: 'Dashboard'
                }),
                ...await models.ability.retrieveAllByEntity({
                    entity: 'Permission'
                }),
                ...await models.ability.retrieveAllByEntity({
                    entity: 'Server'
                }),
                ...await models.ability.retrieveAllByEntity({
                    entity: 'Tag'
                }),
                ...await models.ability.retrieveAllByEntity({
                    entity: 'Metric'
                }),
            ];

            await adminPermission.addAbilities(adminAbilities);
            await adminPermission.setProject(project);
            const servers = await project.getServers();

            const toAdd = await this.#getTagsAndServersOfProject(servers);

            if (toAdd.tags.length > 0) {
                await adminPermission.addTags(toAdd.tags);
            }
            if (toAdd.servers.length > 0) {
                await adminPermission.addServers(toAdd.servers);
            }
            return adminPermission;
        }

        static updateAdminPermission = async ({project = null}) => {
            const adminPermission = await this.findByProjectAndName({
                project: project,
                name: 'admin'
            });

            const servers = await project.getServers();

            const toSet = await this.#getTagsAndServersOfProject(servers);
            await adminPermission.setTags(toSet.tags);
            await adminPermission.setServers(toSet.servers);

            return adminPermission;
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
                await Permission.#validateSameData({name: name, project: project, selfId: selfId});
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

        static retrieveProjectPermissions = async ({projectId = 0}) => {
            const currentProject = await models.project.findByPk(projectId);
            if (currentProject) {
                return await this.findAll({
                    where: {
                        [Op.and]: [
                            {
                                projectId: projectId
                            },
                            // {
                            //     deleted: {
                            //         [Op.is]: null
                            //     }
                            // }
                        ]
                    }
                });
            }
            throw new PermissionCommonError("Fail to get project permissions", [{
                text: "Невозможно получить список Прав у Проекта!"
            }]);
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

        static getSubPermissionsRecursive = async ({permissionId = 0}) => {
            let subPermissions = await models.permission.findAll({
                where: {
                    permissionId: permissionId
                },
            });

            let res = subPermissions;

            if (subPermissions.length > 0) {
                const promises = [];
                subPermissions.forEach(permission => {
                    promises.push(this.getSubPermissionsRecursive({permissionId: permission.id}));
                });

                const children = await Promise.all(promises);

                children.forEach(child => {
                    if (child) {
                        res.push(child);
                    }
                });
            } else{
                return
            }
            return res;
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
                let children = getSubPermissionsRecursive({permissionId: this.id});
                (await children).forEach(permission => {
                    permission.destroy();
                });
            }

            await this.destroy();
        }
    }

    return Permission;
}