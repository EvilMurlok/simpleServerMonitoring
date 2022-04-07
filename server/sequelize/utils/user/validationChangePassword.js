const {UserCredentialsError} = require("../../errors/user/userExceptions");

async function validateNewPasswordData({currentPassword = "", newPassword = "", confirmNewPassword = ""}) {
    let messages = [];
    let [
        rightPassword,
    ] = [
        /^[a-zA-Z0-9_-]+/
    ];

    if (!currentPassword) {
        messages.push(
            {
                text: "Поле текущего пароля обязательно для заполнения!"
            }
        );
    }
    if (!newPassword) {
        messages.push(
            {
                text: "Поле нового пароля обязательно для заполнения!"
            }
        );
    }
    if (!confirmNewPassword) {
        messages.push(
            {
                text: "Поле подтверждения пароля обязательно для заполнения!"
            }
        );
    }

    if (newPassword && newPassword.length < 6) {
        messages.push(
            {
                text: "Новый пароль не должен быть короче 6 символов!"
            }
        );
    }
    if (newPassword && confirmNewPassword && (newPassword !== confirmNewPassword)) {
        messages.push(
            {
                text: "Новые пароли не совпадают!"
            }
        );
    }
    if (newPassword && !rightPassword.test(newPassword)) {
        messages.push(
            {
                text: "Пароль должен состоять только из латинских букв и цифр, символов подчеркивания и тире!"
            }
        );
    }
    if (messages.length > 0) {
        throw new UserCredentialsError("Invalid password Credentials", messages);
    }
}


module.exports = {
    validateNewPasswordData
}