const {Model, DataTypes} = require("sequelize");
const {AbilityCredentialsError} = require("../errors/ability/abilityErrors");

module.exports = (models) => {
    class Ability extends Model {
        static initModel(sequelize) {
            return super.init({
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER
                },
                // ГОВНО
                // name: {
                //     type: DataTypes.STRING(255),
                //     unique: true,
                //     allowNull: false,
                //     is: /^[a-zA-Z]{3,255}$/
                // },
                entity: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    isIn: {
                        args: [['Dashboard', 'Permission', 'Project', 'Server', 'Tag', 'User', 'Metric']],
                        msg: "Invalid type of Ability!"
                    }
                },
                action: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    isIn: {
                        args: [['Create', 'Retrieve', 'Update', 'Delete', 'Share']],
                        msg: "Invalid action of Ability!"
                    }
                },
                detail: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    isIn: {
                        args: [['Hardware', 'Application']],
                        msg: "Invalid detail of Ability!"
                    }
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
                        this.setDataValue('name')
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

        // ГОВНО
        // static #isNameVacant = async (name) => {
        //     return !await Ability.findWithName(name)
        // }
        //
        // static #validationBasedOnClasses = async (entity, action, detail) => {
        //     if (entity === "User") {
        //         return UserAbilityName.constructor(entity, action, detail);
        //     } else if (entity === "Project") {
        //         return ProjectAbilityName.constructor(entity, action, detail);
        //     } else if (entity === "Server") {
        //         return ServerAbilityName.constructor(entity, action, detail);
        //     } else if (entity === "Permission") {
        //         return PermissionAbilityName.constructor(entity, action, detail);
        //     } else if (entity === "Tag") {
        //         return TagAbilityName.constructor(entity, action, detail);
        //     } else if (entity === "Dashboard") {
        //         return DashboardAbilityName.constructor(entity, action, detail);
        //     } else if (entity === "Metric") {
        //         return MetricAbilityName.constructor(entity, action, detail);
        //     }
        // }
        //
        // static #validateName = async (name) => {
        //     // Split name in CamelCase apart
        //     const credentials = name.match(/[A-Z]*[^A-Z]+/g);
        //     if (credentials.length !== 3) {
        //         throw AbilityCredentialsError(
        //             "Invalid name for Ability",
        //             [{
        //                 text: "Ability name must be in CamelCase, start with a capital letter and contain three parts",
        //             }]
        //         );
        //     }
        //     try {
        //         const finalName = await Ability.#validationBasedOnClasses()
        //         console.log(finalName);
        //     } catch (e) {
        //         throw e;
        //     }
        // }
        //
        // static #validateSameData = async (name) => {
        //     let messages = [];
        //
        //     if (!await Ability.#isNameVacant(name)) {
        //         messages.push({
        //             text: `Ability with name ${name} is already in database!`
        //         })
        //     }
        //
        //     if (messages.length > 0) {
        //         throw new AbilitySameCredentialsError("Data repeating for Tag!", messages);
        //     }
        // }
        //
        // static #validateData = async (name) => {
        //     let messages = await Ability.#validateName(name)
        //
        //     if (messages.length > 0) {
        //         throw new AbilityCredentialsError("Invalid data for Ability!", messages);
        //     }
        // }
        //
        // static findWithName = async (abilityName) => {
        //     try {
        //         await Ability.#validateName(abilityName)
        //     } catch (e) {
        //         throw e;
        //     }
        //
        //
        //     return await Ability.findOne({
        //         where: {
        //             name: abilityName
        //         }
        //     });
        // }
        //
        // static createWithValidation = async (abilityName, dashboardConfigurationElement) => {
        //     try {
        //         await Ability.#validateData(abilityName);
        //         await Ability.#validateSameData(abilityName);
        //     } catch (e) {
        //         throw e;
        //     }
        //
        //     if (!dashboardConfigurationElement) {
        //         dashboardConfigurationElement = null;
        //     }
        //
        //     return Ability.create({
        //         name: abilityName,
        //         dashboardConfigurationElement: dashboardConfigurationElement
        //     });
        // }

        static findAllSpecificEntity = async (entity) => {
            const validEntities = ['Dashboard', 'Permission', 'Project', 'Server', 'Tag', 'User', 'Metric'];

            if (!validEntities.includes(entity)) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    [{
                        text: "Invalid entity name for Ability"
                    }]
                );
            }

            return Ability.findAll({
                where: {
                    entity: entity
                }
            });
        }

        static findAllSpecificTypeAndAction = async (entity, action) => {
            const validEntities = ['Dashboard', 'Permission', 'Project', 'Server', 'Tag', 'User', 'Metric'];
            const validActions = ['Create', 'Retrieve', 'Update', 'Delete', 'Share'];

            if (!validEntities.includes(entity)) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    [{
                        text: "Invalid entity name for Ability"
                    }]
                );
            }
            if (!validActions.includes(action)) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    [{
                        text: "Invalid action name for Ability"
                    }]
                );
            }

            return Ability.findAll({
                where: {
                    entity: entity,
                    action: action
                }
            });
        }

        static findAllSpecificTypeAndDetail = async (entity, detail) => {
            const validEntities = ['Dashboard', 'Permission', 'Project', 'Server', 'Tag', 'User', 'Metric'];
            const validDetails = ['Hardware', 'Application'];

            if (!validEntities.includes(entity)) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    [{
                        text: "Invalid entity name for Ability"
                    }]
                );
            }
            if (!validDetails.includes(detail)) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    [{
                        text: "Invalid detail name for Ability"
                    }]
                );
            }

            return Ability.findAll({
                where: {
                    entity: entity,
                    detail: detail
                }
            });
        }

        static findSpecificOne = async (entity, action, detail) => {
            const validEntities = ['Dashboard', 'Permission', 'Project', 'Server', 'Tag', 'User', 'Metric'];
            const validActions = ['Create', 'Retrieve', 'Update', 'Delete', 'Share'];
            const validDetails = ['Hardware', 'Application'];

            if (!validEntities.includes(entity)) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    [{
                        text: "Invalid entity name for Ability"
                    }]
                );
            }
            if (!validActions.includes(action)) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    [{
                        text: "Invalid action name for Ability"
                    }]
                );
            }
            if (!validDetails.includes(detail)) {
                throw new AbilityCredentialsError(
                    "Invalid credentials for Ability",
                    [{
                        text: "Invalid detail name for Ability"
                    }]
                );
            }

            return Ability.findAll({
                where: {
                    entity: entity,
                    action: action,
                    detail: detail
                }
            });
        }

        //  ГОВНО
        // static findAllSpecificTypeAndDetail = async (type, detail) => {
        //     const validType = /([A-Z])([a-zA-Z]+)/g
        //     const validDetail = /([A-Z])([a-zA-Z]+)/g
        //
        //     if (!validType.test(type)) {
        //         throw AbilityCredentialsError(
        //             "Invalid type of Ability!",
        //             [{
        //                 text: "Type must contain only letters and start with capital letter!"
        //             }]
        //         );
        //     }
        //     if (!validDetail.test(detail)) {
        //         throw AbilityCredentialsError(
        //             "Invalid detail of Ability!",
        //             [{
        //                 text: "Detail must contain only letters and start with capital letter!"
        //             }]
        //         );
        //     }
        //
        //     return Ability.findOne({
        //         name: `/(${type})([A-Z][a-z]+)(${detail})/g`
        //     })
        // }
        //
        // static findSpecificOne = async (type, action, detail) => {
        //     try {
        //         const finalName = await Ability.#validationBasedOnClasses(type, action, detail);
        //         console.log(finalName);
        //         return Ability.findOne({
        //             name: finalName
        //         })
        //     } catch (e) {
        //         throw e;
        //     }
        // }
        //
        // static getAllUserAbilities = async() => {
        //     return Ability.findAllSpecificType("User");
        // }
        //
        // static getActionSpecificUserAbility = async(action) => {
        //     return Ability.findSpecificTypeAndAction("User", action);
        // }
        //
        // static getAllProjectAbilities = async() => {
        //     return Ability.findAllSpecificType("Project");
        // }
        //
        // static getActionSpecificProjectAbility = async(action) => {
        //     return Ability.findSpecificTypeAndAction("Project", action);
        // }
        //
        // static getAllServerAbilities = async() => {
        //     return Ability.findAllSpecificType("Server");
        // }
        //
        // static getActionSpecificServerAbility = async(action) => {
        //     return Ability.findSpecificTypeAndAction("Server", action);
        // }
        //
        // static getAllPermissionAbilities = async() => {
        //     return Ability.findAllSpecificType("Permission");
        // }
        //
        // static getActionSpecificPermissionAbility = async(action) => {
        //     return Ability.findSpecificTypeAndAction("Permission", action);
        // }
        //
        // static getAllTagAbilities = async() => {
        //     return Ability.findAllSpecificType("Tag");
        // }
        //
        // static getAllDashboardAbilities = async() => {
        //     return Ability.findAllSpecificType("Dashboard");
        // }
        //
        // static getActionSpecificDashboardAbility = async(action) => {
        //     return Ability.findSpecificTypeAndAction("Dashboard", action);
        // }
        //
        // static getAllMetricAbilities = async() => {
        //     return Ability.findAllSpecificType("Metric");
        // }
        //
        // static getActionSpecificMetricAbility = async(action) => {
        //     return Ability.findSpecificTypeAndAction("Metric", action);
        // }
        //
        // static getAllDetailSpecificMetricAbilities = async(detail) => {
        //     return Ability.findAllSpecificTypeAndDetail("Metric", detail);
        // }
        //
        // static getActionAndDetailSpecificMetricAbility = async(action, detail) => {
        //     return Ability.findSpecificOne("Metric", action, detail);
        // }
    }

    return Ability;
}