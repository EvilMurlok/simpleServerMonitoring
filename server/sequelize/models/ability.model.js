const {Model, DataTypes} = require("sequelize");
const {AbilityCredentialsError, AbilitySameCredentialsError} = require("../errors/ability/abilityErrors");

module.exports = (models) => {
    class Ability extends Model {
        static initModel(sequelize) {
            return super.init({
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER
                },
                entity: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                action: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                detail: {
                    type: DataTypes.STRING,
                    allowNull: true
                },
                name: {
                    type: DataTypes.VIRTUAL,
                    unique: true,
                    set() {
                        let val = `${this.getDataValue('entity')}${this.getDataValue('action')}`;
                        const detail = this.getDataValue('detail');
                        if (detail) {
                            val.concat(detail);
                        }
                        this.setDataValue('name');
                    },
                    get()  {
                        let name = `${this.getDataValue('entity')}${this.getDataValue('action')}`;
                        let detail = this.getDataValue('detail');
                        if (detail) {
                            name = name + detail;
                        }
                        return name;
                    }
                },

                dashboardConfigurationElement: {
                    type: DataTypes.JSON,
                    allowNull: true
                }
            }, {
                modelName: 'ability',
                tableName: 'Ability',
                paranoid: true,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                deletedAt: 'deleted',
                sequelize: sequelize,
            });
        };

        static #validateEntity = async (entity) => {
            const validEntities = ['Dashboard', 'Permission', 'Project', 'Server', 'Tag', 'User', 'Metric'];

            let messages = [];

            if (!entity) {
                messages.push({
                    text: "Сущность в названии Возможности не может быть пустой!"
                });
            }

            if (!validEntities.includes(entity)) {
                messages.push({
                    text: "Сущность в названии Возможности неверна!"
                });
            }

            return messages;
        }

        static #validateAction = async (action) => {
            const validActions = ['Create', 'Retrieve', 'Update', 'Delete', 'Share'];

            let messages = [];

            if (!action) {
                messages.push({
                    text: "Действие в названии Возможности не может быть пустым!"
                });
            }

            if (!validActions.includes(action)) {
                messages.push({
                    text: "Действие в названии Возможности неверно!"
                });
            }

            return messages;
        }

        static #validateDetail = async (detail) => {
            const validDetails = ['Hardware', 'Application'];

            let messages = [];

            if (detail) {
                if (!validDetails.includes(detail)) {
                    messages.push({
                        text: "Уточнение в названии Возможности неверно!"
                    });
                }
            }

            return messages;
        }

        static #validateData = async (entity, action, detail) => {
            let messages = [
                ...await Ability.#validateEntity(entity),
                ...await Ability.#validateAction(action),
                ...await Ability.#validateDetail(detail)
            ]

            console.log(messages);

            if (messages.length > 0) {
                throw AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    messages
                );
            }
        }

        static #validateSameData = async (entity, action, detail) => {
            if (!detail) {
                detail = null;
            }
            const same = await Ability.findOne({
                where: {
                    [Op.and]: {
                        entity: entity,
                        action: action,
                        detail: detail
                    }
                }
            })

            if (same) {
                throw AbilitySameCredentialsError(
                    "Ability with these credentials already exists",
                    [{
                        text: "Возможность с такими данными уже создана!"
                    }]
                );
            }
        }

        static createWithValidation = async (entity, action, detail) => {
            try {
                await Ability.#validateData(entity, action, detail);
                await Ability.#validateSameData(place, entity, action, detail);
            } catch(e) {
                throw e;
            }

            return Ability.create({
                place: place,
                entity: entity,
                action: action,
                detail: detail
            })
        }

        static retrieveAllByEntity = async ({entity: entity}) => {
            let messages = [
                ...await Ability.#validateEntity(entity),
            ];

            if (messages.length > 0) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    messages
                );
            }

            return this.findAll({
                where: {
                    entity: entity
                }
            });
        }

        static retrieveAllByEntityAction = async ({entity: entity, action: action}) => {
            let messages = [
                ...await Ability.#validateEntity(entity),
                ...await Ability.#validateAction(action),
            ];

            if (messages.length > 0) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    messages
                );
            }

            return this.findAll({
                where: {
                    entity: entity,
                    action: action
                }
            });
        }

        static retrieveAllByEntityDetail = async ({entity: entity, detail: detail}) => {
            let messages = [
                ...await Ability.#validateEntity(entity),
                ...await Ability.#validateDetail(detail),
            ];

            if (messages.length > 0) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    messages
                );
            }

            return this.findAll({
                where: {
                    entity: entity,
                    detail: detail
                }
            });
        }

        static retrieveSpecificOne = async ({entity: entity, action: action, detail: detail}) => {
            let messages = [
                ...await Ability.#validateEntity(entity),
                ...await Ability.#validateAction(action),
                ...await Ability.#validateDetail(detail),
            ];

            if (messages.length > 0) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    messages
                );
            }

            if (!detail) {
                detail = null;
            }

            return this.findOne({
                where: {
                    entity: entity,
                    action: action,
                    detail: detail
                }
            });
        }

        editWithValidation = async ({entity: entity, action: action, detail: detail}) => {
            try {
                await Ability.#validateData(entity, action, detail);
                await Ability.#validateSameData(entity, action, detail);
            } catch (e) {
                throw e;
            }

            this.entity = entity;
            this.action = action;
            this.detail = detail;
        }

    }

    return Ability;
}