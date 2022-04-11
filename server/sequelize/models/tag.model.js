const {Model, DataTypes} = require("sequelize");
const generateColor = require("../utils/tags/generateColor")
const {TagSameCredentialsError, TagCredentialsError} = require("../errors/tag/tagErrors");
const {models} = require("../../sequelize");


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
                    allowNull: false
                },
                color: {
                    type: DataTypes.STRING(7),
                    allowNull: false,
                    defaultValue: generateColor()
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

        static #isNameVacant = async ({name = ""}) => {
            return !await Tag.findOneWithName({tagName: name});
        }

        static #validateName = async ({name = ""}) => {
            let messages = [];
            const rightName = /^[a-zA-Z0-9_]{3,255}$/;

            if (!name) {
                messages.push(
                    {
                        text: "Тэг должен иметь название!"
                    }
                );
            }
            if (name && !rightName.test(name)) {
                messages.push(
                    {
                        text: "Название тэга должно содержать только латинские буквы, цифры, дефизы и подчёраиквания!"
                    }
                );
            }
            return messages;
        }

        static #validateColor = async ({color = null}) => {
            let messages = [];
            const rightTagColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

            if (!color) {
                messages.push(
                    {
                        text: "Тэг должен иметь цвет!"
                    }
                );
            }
            if (color && !rightTagColor.test(color)) {
                messages.push(
                    {
                        text: "Цвет тэга должен быть в HEX!"
                    }
                );
            }
            return messages;
        }

        static #validateSameData = async ({name = ""}) => {
            let messages = [];

            if (!await Tag.#isNameVacant({name: name})) {
                messages.push({
                    text: `Тэг с названием ${name} уже существует!`
                });
            }

            if (messages.length > 0) {
                throw new TagSameCredentialsError("Data repeating for Tag!", messages);
            }
        }

        static #validateData = async ({name = "", color = null}) => {
            let messages = [
                ...await Tag.#validateName({name: name}),
                ...await Tag.#validateColor({color: color})
            ]

            if (messages.length > 0) {
                throw new TagCredentialsError("Invalid credentials for Tag!", messages);
            }
        }

        static createWithName = async ({tagName = "", serverIds = []}) => {
            const color = generateColor();

            try {
                await Tag.#validateData({name: tagName, color: color});
                await Tag.#validateSameData({name:tagName});
            } catch (e) {
                throw e;
            }

            const myTag = await this.create({
                name: tagName,
                color: color
            });

            if (serverIds.length > 0) {
                const serversToAdd = await models.server.findAll({
                    where: {
                        id: serverIds
                    }
                });

                console.log(serversToAdd);

                await myTag.addServers(serversToAdd);
            }
            console.log(myTag);
            return myTag;
        }

        static findOneWithName = async ({tagName = ""}) => {
            try {
                await Tag.#validateName(tagName)
            } catch (e) {
                throw e;
            }

            return this.findOne({
                where: {
                    name: tagName
                },
                paranoid: false
            });
        }

        static findOneOrCreateWithName = async ({tagName = ""}) => {
            const color = generateColor();

            try {
                await Tag.#validateData({name: tagName, color: color});
            } catch (e) {
                throw e;
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
                color: color
            });
        }

        static retrieveAllProjectTags = async ({project = null}) => {
            const adminPerm = await models.permission.findByProjectAndName({
                project: project,
                name: 'admin'
            });

            return adminPerm.getTags();
        }

        editWithValidation = async({tagName = "", color = null, serverIds = []}) => {
            try {
                await Tag.#validateName(tagName);
                if (color) {
                    await Tag.#validateColor(color);
                    this.color = color;
                }
                this.name = tagName;
            } catch(e) {
                throw e;
            }

            if (serverIds.length > 0) {
                const newServers = await models.server.findAll({
                    where: {
                        id: serverIds
                    }
                });
                this.setServers(newServers);
            }
        }

        mergeWith = async ({tag = null}) => {
            tag.addServers(await this.getServers());
            // this.removeServers(servers)
            await this.destroy();

            return tag;
        }

        addToProjectServers = async ({project = null}) => {
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