const { Model, DataTypes, Op} = require("sequelize");


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
                    // is: /^[a-zA-Z0-9_]{3,255}$/б
                    validate: {
                        is: {
                            args: /^[a-zA-Z0-9_]{3,255}$/,
                            msg: "Permission name can contain only latin letters, numbers, underscores and dashes!"
                        },
                        notNull: {
                            msg: "Permission must have a name"
                        }
                    }
                },
                end_of_life: {
                    type: DataTypes.DATE,
                    validate: {
                        isInFuture(value) {
                            if (value > Date.now()) {
                                throw new Error("end_of_life can't be in the past");
                            }
                        }
                    }
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

        // ГОВНО
        // static #validateName = async (name) => {
        //     let messages = [];
        //     const rightName = /^[a-zA-Z0-9_]{3,255}$/;
        //
        //     if (!name) {
        //         messages.push(
        //             {
        //                 text: "Permission must have a name"
        //             }
        //         );
        //     }
        //     if (name && !rightName.test(name)) {
        //         messages.push(
        //             {
        //                 text: "Permission name can contain only latin letters, numbers, underscores and dashes!"
        //             }
        //         );
        //     }
        //     return messages;
        // }
        //
        // static #validateData = async (name) => {
        //     let messages = await Permission.#validateName(name)
        //
        //     if (messages.length > 0) {
        //         throw new PermissionCredentialsError("Invalid data for Ability!", messages);
        //     }
        // }

        static createSuperPermission = async () => {
            const adminPermission = await this.create({
                name: "super",
            });
            await adminPermission.addAbilities(await models.ability.findAll());

            return adminPermission;
        };

        static createCustomPermissionByAbilities = async (name, abilities) => {
            const customPermission = await this.create({
                name: name,
            });
            return customPermission.addAbilities(abilities);
        };

        // КРИНЖ
        // static createCustomPermissionByAbilityIds = async (name, abilityIds) => {
        //     // try {
        //     //     await Permission.#validateData(name);
        //     // } catch (e) {
        //     //     throw e;
        //     // }
        //
        //     const abilities = await models.ability.findAll({
        //         where: {
        //             id: {
        //                 [Op.or]: abilityIds
        //             }
        //         }
        //     });
        //
        //     return Permission.createCustomPermissionByAbilities(name, abilities);
        // };
        //
        // static createCustomPermissionByAbilityNames = async (name, abilityNames) => {
        //     // try {
        //     //     await Permission.#validateData(name);
        //     // } catch (e) {
        //     //     throw e;
        //     // }
        //
        //     const abilities = await models.ability.findAll({
        //         where: {
        //             name: {
        //                 [Op.or]: abilityNames
        //             }
        //         }
        //     });
        //
        //     return Permission.createCustomPermissionByAbilities(name, abilities);
        // };
        //
        // addToProjectById = async (projectId) => {
        //     return this.addProject(await models.project.findByPk(projectId));
        // }
        //
        // addToProjectsById = async (projectIds) => {
        //     const projects = await models.project.findAll({
        //         where: {
        //             id: {
        //                 [Op.or]: projectIds
        //             }
        //         }
        //     });
        //
        //     return this.addProjects(projects);
        // }
        //
        // addToUserById = async (userId) => {
        //     return this.adduser(models.user.findByPk(userId));
        // }
        //
        // addToUserByName = async (username) => {
        //     return this.adduser(models.user.findOne({
        //         where: {
        //             username: username
        //         }
        //     }));
        // }
        //
        // addToUsersById = async (userIds) => {
        //     const users = await models.user.findAll({
        //         where: {
        //             id: {
        //                 [Op.or]: userIds
        //             }
        //         }
        //     })
        //
        //     return this.addUsers(users);
        // }
        //
        // addToUsersByName = async (usernames) => {
        //     const users = await models.user.findAll({
        //         where: {
        //             name: {
        //                 [Op.or]: usernames
        //             }
        //         }
        //     })
        //
        //     return this.addUsers(users);
        // }
        //
        // addServerById = async (serverId) => {
        //     return this.addServer(await models.server.findByPk(serverId));
        // }
        //
        // addServersById = async (serverIds) => {
        //     const servers = await models.server.findAll({
        //         where: {
        //             id: {
        //                 [Op.or]: serverIds
        //             }
        //         }
        //     });
        //
        //     return this.addServers(servers);
        // }
        //
        // addTagById = async (tagId) => {
        //     return this.addTag(models.tag.findByPk(tagId));
        // }
        //
        // addTagByName = async (name) => {
        //     return this.addTag(models.tag.findOne({
        //         where: {
        //             name: name
        //         }
        //     }));
        // }
        //
        // addTagsById = async (tagIds) => {
        //     const tags = await models.tag.findAll({
        //         where: {
        //             id: {
        //                 [Op.or]: tagIds
        //             }
        //         }
        //     })
        //
        //     return this.addTags(tags);
        // }
        //
        // addTagsByName = async (names) => {
        //     const tags = await models.tag.findAll({
        //         where: {
        //             name: {
        //                 [Op.or]: names
        //             }
        //         }
        //     })
        //
        //     return this.addTags(tags);
        // }
        //
        // addToDashboardById = async (dashboardId) => {
        //     return this.addDashboard(await models.dashboard.findByPk(dashboardId));
        // }
        //
        // addToDashboardsById = async (dashboardIds) => {
        //     const dashboards = await models.dashboard.findAll({
        //         where: {
        //             id: {
        //                 [Op.or]: dashboardIds
        //             }
        //         }
        //     });
        //
        //     return this.addDashboards(dashboards);
        // }
        //
        // addAbilityById = async (abilityId) => {
        //     return this.addAbility(await models.ability.findByPk(abilityId));
        // }
        //
        // addAbilitiesById = async (abilityIds) => {
        //     const abilities = await models.ability.findAll({
        //         where: {
        //             id: {
        //                 [Op.or]: abilityIds
        //             }
        //         }
        //     });
        //
        //     return this.addAbilities(abilities);
        // }
    }

    return Permission;
}