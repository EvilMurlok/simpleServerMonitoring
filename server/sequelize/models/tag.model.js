const {Model, DataTypes, Op} = require("sequelize");
const generateColor = require("../utils/tags/generateColor")
const {
    TagSameCredentialsError, TagCredentialsError,
    TagNotUpdatedError, TagDeletionError,
    TagTransactionError
} = require("../errors/tag/tagErrors");


module.exports = (sequelize) => {
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

        static #validateSameData = async ({name = "", currentName = ""}, isEdition = false) => {
            const messages = [];
            let sameTag = "";
            if (isEdition) {
                sameTag = await Tag.findOne({
                    where: {
                        [Op.and]: [
                            {
                                name: name
                            },
                            {
                                name: {
                                    [Op.ne]: currentName
                                }
                            }
                        ]
                    }
                });
            } else {
                sameTag = await Tag.findOne({
                    where: {name: name}
                });
            }

            if (sameTag) {
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
                await Tag.#validateSameData({name: tagName});
            } catch (e) {
                throw e;
            }

            const t = await sequelize.transaction();
            try {
                const myTag = await this.create({
                    name: tagName,
                    color: color
                }, {transaction: t});
                if (serverIds.length > 0) {
                    const serversToAdd = await sequelize.models.server.findAll({
                        where: {
                            id: serverIds
                        }
                    }, {transaction: t});
                    await myTag.addServers(serversToAdd, {transaction: t});
                    const projectsByServers = await sequelize.models.server.getProjectsByServers({serverIds: serverIds}, {transaction: t});
                    console.log(projectsByServers);
                    for (let project of projectsByServers) {
                        const projectAdminPermission = await sequelize.models.permission.findOne({
                            where: {name: `admin${project.name}`}
                        }, {transaction: t});
                        await projectAdminPermission.addTags([myTag], {transaction: t});
                    }
                }

                await t.commit();
                return myTag;
            } catch (e) {
                console.error(e);
                await t.rollback();
                throw new TagTransactionError("An error occurred during the transaction", [{text: "Ошибка при создании тега и добавлении его в право администратора проекта!"}]);
            }
        }

        static retrieveTag = async ({userId = 0, tagId = 0, tagName = ""}) => {
            const currentTag = await this.findOne({
                where: {
                    [Op.or]: [
                        {
                            name: tagName
                        },
                        {
                            id: tagId
                        }
                    ]
                },
                attributes: ["id", "name", "color", "created"],
                include: {
                    model: sequelize.models.server,
                    required: true,
                    where: {
                        deleted: {
                            [Op.is]: null
                        }
                    },
                    attributes: ["id", "ip", "hostname", "created"],
                    through: {attributes: []}
                }
            });
            let userPermissionsWithTag = await this.findOne({
                where: {id: tagId},
                attributes: ["id"],
                include: {
                    model: sequelize.models.permission,
                    attributes: ["id"],
                    through: {attributes: []},
                    required: true,
                    include: [
                        {
                            model: sequelize.models.ability,
                            required: true,
                            where: {
                                entity: "Tag",
                                action: {
                                    [Op.in]: ["Update", "Delete"]
                                }
                            },
                            attributes: ["entity", "action"],
                            through: {attributes: []}
                        },
                        {
                            model: sequelize.models.user,
                            required: true,
                            where: {id: userId},
                            attributes: [],
                            through: {attributes: []}
                        }
                    ]
                }

            });
            let [isAbleToUpdateTag, isAbleToDeleteTag] = [false, false];
            if (userPermissionsWithTag && userPermissionsWithTag.permissions && userPermissionsWithTag.permissions.length > 0) {
                userPermissionsWithTag = userPermissionsWithTag.permissions;
                for (let userPermissionWithTag of userPermissionsWithTag) {
                    for (let ability of userPermissionWithTag.abilities) {
                        if (ability.action === "Update") {
                            isAbleToUpdateTag = true;
                        }
                        if (ability.action === "Delete") {
                            isAbleToDeleteTag = true;
                        }
                    }
                }
            }
            return [currentTag, isAbleToUpdateTag, isAbleToDeleteTag];
        }

        static retrieveAvailableTags = async ({
                                                  userId = 0,
                                                  tagName = "%",
                                                  ip = "%",
                                                  hostname = "%",
                                                  createdMin = "1970-01-01T00:00:00.000Z",
                                                  createdMax = new Date(new Date().setHours(new Date().getHours() + 3)).toISOString()
                                              }) => {
            const availableTags = await this.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${tagName}%`
                    },
                    created: {
                        [Op.gte]: createdMin,
                        [Op.lte]: createdMax
                    },
                },
                attributes: ["id", "name", "color", "created"],
                include: [
                    {
                        model: sequelize.models.permission,
                        attributes: ["id"],
                        through: {attributes: []},
                        required: true,
                        include: [
                            {
                                model: sequelize.models.ability,
                                required: true,
                                where: {
                                    entity: "Tag",
                                    action: {
                                        [Op.in]: ["Retrieve", "Update", "Delete"]
                                    }
                                },
                                attributes: ["entity", "action"],
                                through: {attributes: []}
                            },
                            {
                                model: sequelize.models.user,
                                required: true,
                                where: {id: userId},
                                attributes: [],
                                through: {attributes: []}
                            }
                        ]
                    },
                    {
                        model: sequelize.models.server,
                        where: {
                            ip: {
                                [Op.iLike]: `%${ip}%`
                            },
                            hostname: {
                                [Op.iLike]: `%${hostname}%`
                            }
                        },
                        attributes: ["id", "ip", "hostname"],
                        through: {attributes: []},
                        required: hostname !== "%" || ip !== "%",
                        include: {
                            model: sequelize.models.permission,
                            attributes: ["id"],
                            through: {attributes: []},
                            required: true,
                            include: [
                                {
                                    model: sequelize.models.ability,
                                    required: true,
                                    where: {
                                        entity: "Server",
                                        action: "Retrieve"
                                    },
                                    attributes: ["entity", "action"],
                                    through: {attributes: []}
                                },
                                {
                                    model: sequelize.models.user,
                                    required: true,
                                    where: {id: userId},
                                    attributes: [],
                                    through: {attributes: []}
                                }
                            ]
                        },
                        order: [["hostname", "ASC"]]
                    }
                ],
                order: [["name", "DESC"]]
            });
            const alreadyAddedTags = [];
            const availableTagsWithActions = [];
            for (let availableTag of availableTags) {
                if (!alreadyAddedTags.includes(availableTag.name)) {
                    let [isAbleToUpdateTag, isAbleToDeleteTag] = [false, false];
                    for (let permission of availableTag.permissions) {
                        for (let ability of permission.abilities) {
                            if (ability.entity === "Tag" && ability.action === "Update") {
                                isAbleToUpdateTag = true;
                            }
                            if (ability.entity === "Tag" && ability.action === "Delete") {
                                isAbleToDeleteTag = true;
                            }
                        }
                    }
                    availableTagsWithActions.push({
                        id: availableTag.id,
                        name: availableTag.name,
                        color: availableTag.color,
                        created: availableTag.created,
                        servers: availableTag.servers,
                        isAbleToUpdateTag: isAbleToUpdateTag,
                        isAbleToDeleteTag: isAbleToDeleteTag
                    });
                    alreadyAddedTags.push(availableTag.name);
                }
            }
            return availableTagsWithActions;
        }

        static retrieveTagsByName = async ({tagName = "%"}) => {
            return (await sequelize.models.tag.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${tagName}%`
                    }
                },
                attributes: ["name"]
            })).map(tag => tag.name);
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

            return await this.create({
                name: tagName,
                color: color
            });
        }

        static retrieveAllProjectTags = async ({project = null}) => {
            const adminPerm = await sequelize.models.permission.findByProjectAndName({
                project: project,
                name: 'admin'
            });

            return adminPerm.getTags();
        }

        static retrieveAllTags = async () => {
            return await Tag.findAll({
                attributes: ["id", "name", "color"]
            });
        }

        editTag = async ({name = "", color = "", serverIds = []}) => {
            let isSameTagData = false;
            try {
                await Tag.#validateName({name});
                await Tag.#validateSameData({name, currentName: this.name}, true);
                if (color) {
                    await Tag.#validateColor({color});
                    isSameTagData = this.name === name && this.color === color;
                    this.color = color;
                }
                this.name = name;
                await this.save();
            } catch (e) {
                throw e;
            }
            if (isSameTagData) {
                throw new TagNotUpdatedError("The tag data was not updated", [{
                    text: "Информация о теге изменена не была"
                }]);
            }
            // if (serverIds.length > 0) {
            //     const newServers = await models.server.findAll({
            //         where: {
            //             id: serverIds
            //         }
            //     });
            //     this.setServers(newServers);
            // }
            return this;
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
            } else {
                throw new TagDeletionError("Fail to delete the tag!", [{
                    text: "Ошибка при удалении тега!"
                }]);
            }
        }

        static deleteTag = async ({tagId = 0}) => {
            const deletedTag = await this.destroy({
                where: {id: tagId}
            });
            if (deletedTag > 0) {
                return deletedTag;
            } else {
                throw new TagDeletionError("Fail to delete the tag!", [{
                    text: "Ошибка при удалении тега!"
                }]);
            }
        }

        briefInfo = async () => {
            return `${this.name} ${this.color}`;
        }
    }


    return Tag;
}