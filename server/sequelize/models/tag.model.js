const {Model, DataTypes, Op} = require("sequelize");
const generateColor = require("../utils/tags/generateColor")
const {TagSameCredentialsError, TagCredentialsError} = require("../errors/tag/tagErrors");


module.exports = (models) => {
    class Tag extends Model {
        static initModel(sequelize) {
            return super.init({
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER
                },
                name: {
                    type: DataTypes.STRING(255),
                    unique: true,
                    allowNull: false,
                    validate: {
                        is: {
                            args: /^[a-zA-Z0-9_]{3,255}$/,
                            msg: "Tag name can contain only latin letters, numbers, underscores and dashes!"
                        },
                        notNull: {
                            msg: "Tag must have a name"
                        }
                    }
                },
                color: {
                    type: DataTypes.STRING(7),
                    allowNull: false,
                    defaultValue: generateColor(),
                    validate: {
                        is: {
                            args: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
                            msg: "Tag color must be in HEX!"
                        },
                        notNull: {
                            msg: "Tag must have a color!"
                        }
                    }
                }
            }, {
                modelName: 'tag',
                tableName: 'Tag',
                paranoid: true,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                deletedAt: 'deleted',
                sequelize: sequelize,
            });
        };
        // ГОВНО!
        // static #isNameVacant = async (name) => {
        //     return !await Tag.findWithName(name)
        // }
        //
        // static #validateName = async (name) => {
        //     let messages = [];
        //     const rightName = /^[a-zA-Z0-9_]{3,255}$/;
        //
        //     if (!name) {
        //         messages.push(
        //             {
        //                 text: "Tag must have a name"
        //             }
        //         );
        //     }
        //     if (name && !rightName.test(name)) {
        //         messages.push(
        //             {
        //                 text: "Tag name can contain only latin letters, numbers, underscores and dashes!"
        //             }
        //         );
        //     }
        //     return messages;
        // }
        //
        // static #validateColor = async (color) => {
        //     let messages = [];
        //     const rightTagColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
        //
        //     if (!color) {
        //         messages.push(
        //             {
        //                 text: "Tag must have a color!"
        //             }
        //         );
        //     }
        //     if (color && !rightTagColor.test(color)) {
        //         messages.push(
        //             {
        //                 text: "Tag color must be in HEX!"
        //             }
        //         );
        //     }
        //     return messages;
        // }
        //
        // static #validateSameData = async (name) => {
        //     let messages = [];
        //
        //     if (!await Tag.#isNameVacant(name)) {
        //         messages.push({
        //             text: `Tag with name ${name} is already in database!`
        //         })
        //     }
        //
        //     if (messages.length > 0) {
        //         throw new TagSameCredentialsError("Data repeating for Tag!", messages);
        //     }
        // }
        //
        // static #validateData = async (name, color) => {
        //     let parts = [
        //         ...await Tag.#validateName(name),
        //         ...await Tag.#validateColor(color)
        //     ]
        //
        //     let messages = []
        //
        //     for (let part in parts) {
        //         messages.push(...part)
        //     }
        //
        //     if (messages.length > 0) {
        //         throw new TagCredentialsError("Invalid data for Tag!", messages);
        //     }
        // }
        //
        // static createWithName = async (tagName) => {
        //
        //     try {
        //         await Tag.#validateData(tagName, color);
        //         await Tag.#validateSameData(tagName);
        //     } catch (e) {
        //         throw e;
        //     }
        //
        //     return this.create({
        //         name: tagName,
        //         color: color
        //     });
        // }
        //
        // static findWithName = async (tagName) => {
        //     try {
        //         await Tag.#validateName(tagName)
        //     } catch (e) {
        //         throw e;
        //     }
        //
        //     return await Tag.findOne({
        //         where: {
        //             name: tagName
        //
        //         }
        //     });
        // }
        //

        static findOneWithName = async (tagName) => {
            let validName = /^[a-zA-Z0-9_]{3,255}$/;
            if (!validName.test(tagName)) {
                throw TagCredentialsError(
                    "Invalid credentials for Tag",
                    [{
                        text: "Invalid name for Tag"
                    }]
                )
            }

            return this.findOne({
                where: {
                    name: tagName
                },
                paranoid: false
            });
        }

        static findOneOrCreateWithName = async (tagName) => {
            let validName = /^[a-zA-Z0-9_]{3,255}$/;
            if (!validName.test(tagName)) {
                throw TagCredentialsError(
                    "Invalid credentials for Tag",
                    [{
                        text: "Invalid name for Tag"
                    }]
                )
            }

            const tag = await this.findOne({
                where: {
                    name: tagName
                },
                paranoid: false
            });

            if (tag) {
                if (tag.isSoftDeleted()) {
                    await tag.restore();
                }
                return tag;
            }

            return this.create({
                name: tagName,
            });
        }

        mergeWith = async (tag) => {
            tag.addServers(await this.getServers());
            // this.removeServers(servers)
            await this.destroy();

            return tag;
        }

        // ГОВНО 2
        // mergeWithByName = async (tagName) => {
        //     return this.#mergeWith(await Tag.findWithName(tagName));
        // }
        //
        // addToServerById = async (serverId) => {
        //     return this.addServer(await models.server.findByPk(serverId));
        // }
        //
        // addToServersById = async (serverIds) => {
        //     return this.addServers(
        //         await models.server.findAll({
        //             where: {
        //                 id: {
        //                     [Op.or]: serverIds
        //                 }
        //             }
        //         })
        //     );
        // }
        //
        // addToPermissionById = async (permissionId) => {
        //     return this.addPermission(await models.permission.findByPk(permissionId));
        // }
        //
        // addToPermissionsById = async (permissionIds) => {
        //     return this.addPermissions(
        //         await models.permission.findAll({
        //             where: {
        //                 id: {
        //                     [Op.or]: permissionIds
        //                 }
        //             }
        //         })
        //     );
        // }

        addToProjectServers = async (project) => {
            return this.addServers(project.getServers())
        }

        destroyIfNotUsed = async () => {
            if (await this.countServers() <= 0) {
                return this.destroy();
            }
        }

        briefInfo = async () => {
            return `${this.name} ${this.color}`;
        }
    }


    return Tag;
}