const {Model, Op, DataTypes} = require("sequelize");
const bcrypt = require("bcrypt");

const {validateUserData} = require("../utils/user/validationUserData");
const {validateSameUserData} = require("../utils/user/validationSameUserData");
const {validateNewPasswordData} = require("../utils/user/validationChangePassword");
const {
    UserNotUpdatedDataError, UserNotFoundError,
    UserDeletionError, UserCredentialsError
} = require("../errors/user/userExceptions");

module.exports = (models) => {
    class User extends Model {
        static initModel(sequelize) {
            return super.init({
                id: {
                    autoIncrement: true,
                    primaryKey: true,
                    type: DataTypes.INTEGER
                },
                username: {
                    type: DataTypes.STRING(70),
                    allowNull: false,
                    unique: true,
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
                    is: /^[+]*[0-9]{0,3}[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    is: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
                },
                grafana_username: {
                    type: DataTypes.STRING,
                    is: /^[a-zA-Z0-9_]{5,255}$/
                }
            }, {
                modelName: 'user',
                tableName: 'User',
                paranoid: true,
                timestamps: true,
                createdAt: 'created',
                updatedAt: 'updated',
                deletedAt: 'deleted',
                sequelize: sequelize,
            });
        };

        v

        static registerUser = async ({username = "", phone = "", email = "", password = "", confirm_password = ""}) => {
            try {
                await validateUserData({username, phone, email, password, confirm_password});
                await validateSameUserData.bind(this)({username, phone, email});
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

        static editUser = async ({username = "", phone = "", email = "", userId = 0}) => {
            const currentUser = await this.findByPk(userId);
            if (currentUser) {
                const [usernameUser, emailUser, phoneUser] = [currentUser.username, currentUser.email, currentUser.phone];
                if (usernameUser === username && phoneUser === phone && emailUser === email) {
                    throw new UserNotUpdatedDataError("Data was not changed", [{text: `Данные о пользователе ${username} изменены не были!`}]);
                } else {
                    try {
                        await validateUserData({username, phone, email}, true);
                        await validateSameUserData.bind(this)({
                            username,
                            phone,
                            email,
                            usernameUser,
                            phoneUser,
                            emailUser
                        }, true);
                    } catch (e) {
                        throw e;
                    }
                }
                return [await this.update({
                    username: username,
                    phone: phone,
                    email: email
                }, {
                    where: {
                        id: userId
                    }
                }), {username, phone, email}];
            }
        }

        static changePassword = async ({userId, currentPassword, newPassword, confirmNewPassword}) => {
            const currentUser = await this.findByPk(userId);
            let message = "";
            if (currentUser) {
                try {
                    await validateNewPasswordData({currentPassword, newPassword, confirmNewPassword});
                } catch (e) {
                    throw e;
                }
                const bool = await bcrypt.compare(currentPassword, currentUser.password);
                if (!bool) {
                    throw new UserCredentialsError("Wrong current password", [{text: "Неверный текущий пароль!"}]);
                } else {
                    let hashedPassword = await bcrypt.hash(newPassword, 10);
                    return await this.update({
                        password: hashedPassword
                    }, {
                        where: {
                            id: userId
                        }
                    });
                }
            }
            throw new UserNotFoundError("Fail to update password", [{text: "Пароль изменить не удалось!"}]);
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
                return currentUser;
            }
            throw new UserNotFoundError("Such user not found", [{
                text: "Такого пользователя не существует!"
            }]);
        }

        static deletionUser = async ({userId = 0}) => {
            const deletedUserNumber = await this.destroy({
                where: {
                    id: userId
                }
            });
            console.log(deletedUserNumber);
            if (deletedUserNumber) {
                return deletedUserNumber;
            } else {
                throw new UserDeletionError("User could not be deleted", [{
                    text: "Не удалось удалить пользователя!"
                }]);
            }
        }
    }

    return User;
};