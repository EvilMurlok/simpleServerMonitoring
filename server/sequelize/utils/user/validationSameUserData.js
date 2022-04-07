const {Op} = require("sequelize");

const {UserSameCredentialsError} = require("../../errors/user/userExceptions")

async function validateSameUserData({username, phone, email, usernameUser, phoneUser, emailUser}, isEdition = false) {
    let messages = [];
    let [userUsername, userEmail, userPhone] = ["", "", ""];
    if (isEdition) {
        userUsername = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        username: username
                    },
                    {
                        username: {
                            [Op.ne]: usernameUser
                        }
                    },
                    {
                        deleted: {
                            [Op.is]: null,
                        }
                    }
                ]
            }
        });
        userEmail = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        email: email
                    },
                    {
                        email: {
                            [Op.ne]: emailUser
                        }
                    },
                    {
                        deleted: {
                            [Op.is]: null,
                        }
                    }
                ]
            }
        });
        userPhone = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        phone: phone
                    },
                    {
                        phone: {
                            [Op.ne]: phoneUser
                        }
                    },
                    {
                        deleted: {
                            [Op.is]: null,
                        }
                    }
                ]
            }
        });
    } else {
        userUsername = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        username: username
                    },
                ]
            }
        });
        userEmail = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        email: email
                    },
                    {
                        deleted: {
                            [Op.is]: null,
                        }
                    }
                ]
            }
        });
        userPhone = await this.findOne({
            where: {
                [Op.and]: [
                    {
                        phone: phone
                    },
                    {
                        deleted: {
                            [Op.is]: null,
                        }
                    }
                ]
            }
        });
    }
    console.log(userPhone, userEmail, userUsername);
    if (userUsername) {
        messages.push(
            {
                text: "Пользователь с таким никнеймом уже существует!"
            }
        );
    }
    if (userEmail) {
        messages.push(
            {
                text: "Пользователь с таким адресом почты уже существует!"
            }
        );
    }
    if (userPhone) {
        messages.push(
            {
                text: "Пользователь с таким телефоном уже существует!"
            }
        );
    }

    if (messages.length > 0) {
        throw new UserSameCredentialsError("User with such data is already in database", messages);
    }
}

module.exports = {
    validateSameUserData
};