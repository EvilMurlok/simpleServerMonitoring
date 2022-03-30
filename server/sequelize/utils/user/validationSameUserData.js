const {UserSameCredentialsError} = require("../../errors/user/userExceptions")

async function validateSameUserData({username, phone, email}) {
    let messages = [];
    const userUsername = await this.findOne({
        where: {
            username: username
        }
    });
    const userEmail = await this.findOne({
        where: {
            email: email
        }
    });
    const userPhone = await this.findOne({
        where: {
            phone: phone
        }
    });
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