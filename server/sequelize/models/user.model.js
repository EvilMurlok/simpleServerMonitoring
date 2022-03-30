const {Model, Op} = require("sequelize");
const bcrypt = require("bcrypt");

const {validateUserData} = require("../utils/user/validationUserData");
const {validateSameUserData} = require("../utils/user/validationSameUserData");

module.exports = class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init({
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            username: {
                type: DataTypes.STRING(70),
                unique: true,
                allowNull: false,
                is: /^[a-zA-Z0-9_]{3,70}$/
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                is: /^[a-zA-Z0-9_-]+/
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                is: /^[+]*[0-9]{0,3}[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                is: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
            },
            grafana_username: {
                type: DataTypes.STRING,
                unique: true,
                is: /^[a-zA-Z0-9_]{5,255}$/
            }
        }, {
            modelName: 'user',
            tableName: 'user',
            paranoid: true,
            timestamps: true,
            createdAt: 'created',
            updatedAt: 'updated',
            deletedAt: 'deleted',
            sequelize: sequelize,
        });
    };

    static registerUser = async ({username, phone, email, password, confirm_password}) => {

        try {
            await validateUserData({username, phone, email, password, confirm_password}, true);
            const bindValidateSameUserData = validateSameUserData.bind(this);
            await bindValidateSameUserData({username, phone, email});
        } catch (e) {
            throw e;
        }

        let hashedPassword = await bcrypt.hash(password, 10);

        return await this.create({
            username: username,
            password: hashedPassword,
            phone: phone,
            email: email
        });
    };

    static editUser = async ({username, phone, email, userId}) => {
        let messages = await validateUserData({username, phone, email}, true);
        if (messages.length > 0) {
            return {
                messages: messages,
                status: "danger"
            };
        } else {
            const currentUser = await this.findByPk(userId);
            if (currentUser.username === username && currentUser.phone === phone && currentUser.email === email) {
                return {
                    status: "info",
                    messages: [{
                        text: `Информация о пользователе ${username} изменена не была`
                    },]
                };
            }
            await this.update({
                username: username,
                phone: phone,
                email: email
            }, {
                where: {
                    id: userId
                }
            });
            return {
                status: "success",
                messages: [{
                    text: `Информация о пользователе ${currentUser.username} успешно изменена!`
                },]
            };

        }
    }

    static retrieveUser = async ({userId = 0, username = "", phone = "", email = ""}) => {
        const currentUser = await this.findOne({
            where: {
                [Op.or]: [
                    {
                        id: userId
                    },
                    {
                        username: username
                    },
                    {
                        phone: phone
                    },
                    {
                        email: email
                    }
                ]
            }
        });
        if (currentUser) {
            return {
                user: currentUser,
                status: "success"
            };
        }
        return {
            status: "danger",
            messages: [{
                text: "Такого пользователя не существует!"
            }]
        };
    }

    static deletionUser = async ({userId}) => {
        const deletedUser = await this.destroy({
            where: {
                id: userId
            }
        });
        if (deletedUser) {
            return {
                status: "success",
                messages: [{
                    text: `Пользователь успешно удален!`
                },]
            };
        } else {
            return {
                status: "danger",
                messages: [{
                    text: `При удалении возникла ошибка!`
                },]
            };
        }
    }
};