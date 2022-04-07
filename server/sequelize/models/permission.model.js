const {Model, DataTypes, Op} = require("sequelize");
const {
    PermissionCredentialsError,
    PermissionSameCredentialsError,
    PermissionInheritanceError
} = require("../errors/permission/permissionErrors");


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

        static #validateName = async (name) => {
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

        static #validateDate = async (date) => {
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

        static #validateData = async (name, date) => {
            let messages = [
                ...await Permission.#validateName(name),
                ...await Permission.#validateDate(date)
            ]

            if (messages.length > 0) {
                throw new PermissionCredentialsError("Invalid data for Permission!", messages);
            }
        }

        static #validateSameData = async (name, project) => {
            if (!project) {
                throw new PermissionCredentialsError(
                    "Invalid credentials for Permission",
                    [{
                        text: "Необходимо указать проект, с которым связано Право!"
                    }]
                );
            }

            const sameNamePermission = await project.getPermissions({
                where: {
                    name: name
                }
            });

            if (sameNamePermission.length > 0) {
                throw new PermissionSameCredentialsError(
                    "Same name for permission",
                    [{
                        text: `Внутри этого проекта ${project.name} уже есть право с таким именем!`
                    }]
                );
            }
        }

        static findByProjectAndName = async ({project: project, name: name}) => {
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

        // can do anything in the project
        static createAdminPermission = async ({project = null}) => {
            try {
                await Permission.#validateSameData('admin', project);
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
            ]

            await adminPermission.addAbilities(adminAbilities);
            await adminPermission.setProject(project);

            const servers = await project.getServers()

            let tags = [];
            for (let server of servers) {
                const serverTags = server.getTags();
                if (serverTags.length <= 0) {
                    await adminPermission.addServer(server);
                } else {
                    tags.push(...serverTags);
                }
            }

            await adminPermission.addTags(tags);
            return adminPermission;
        }

        static updateAdminPermission = async ({project = null}) => {
            const adminPermission = await this.findByProjectAndName({
                project: project,
                name: 'admin'
            });

            const servers = await project.getServers();

            let tags = [];
            const serversToAdd = [];
            for (let server of servers) {
                const serverTags = await server.getTags();
                if (serverTags.length <= 0) {
                    serversToAdd.push(server);
                } else {
                    tags.push(...serverTags);
                }
            }

            if (serversToAdd.length > 0) {
                await adminPermission.setServers(serversToAdd);
            }
            if (tags.length > 0) {
                await adminPermission.setTags(tags);
            }
            return adminPermission;
        }

        static #credentialsValidation = async ({
                                                   creator = null,
                                                   masterPermission = null,
                                                   name = "",
                                                   project = null,
                                                   abilities = [],
                                                   tags = [],
                                                   servers = [],
                                                   users = []
                                               }) => {
            try {
                await Permission.#validateData(name);
                await Permission.#validateSameData(name, project);
            } catch (e) {
                throw e;
            }

            let messages = [];

            if (!creator) {
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

            if (!await creator.hasPermission(masterPermission)) {
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
            let messages = await this.#credentialsValidation({
                creator: creator,
                masterPermission: masterPermission,
                name: name,
                project: project,
                abilities: abilities,
                tags: tags,
                servers: servers,
                users: users
            });

            if (messages.length > 0) {
                throw PermissionCredentialsError(
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
                creator: editor,
                masterPermission: masterPermission,
                name: name,
                project: project,
                abilities: abilities,
                tags: tags,
                servers: servers,
                users: users
            });

            if (messages.length > 0) {
                throw PermissionCredentialsError(
                    "Invalid credentials for Permission creation",
                    messages
                );
            }

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

        test = async () => {
            return "test";
        }
    }

    return Permission;
}