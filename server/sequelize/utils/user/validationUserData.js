const {UserCredentialsException} = require("../../errors/user/userExceptions");

async function validateUserData({username, phone, email, password, confirm_password}, isRegistry=false) {
    let messages = [];
    let [
        rightUsername,
        rightPassword,
        rightPhone,
        rightEmail,

    ] = [
        /^[a-zA-Z0-9_]{3,16}$/,
        /^[a-zA-Z0-9_-]+/,
        /^[+]*[0-9]{0,3}[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
    ];
    if (!username) {
        messages.push(
            {
                text: "Поле никнейма обязательно для заполнения!"
            }
        );
    }
    if (isRegistry && !password) {
        messages.push(
            {
                text: "Поле никнейма обязательно для заполнения!"
            }
        );
    }
    if (isRegistry && !confirm_password) {
        messages.push(
            {
                text: "Поле 'подтверждения пароля' обязательно для заполнения!"
            }
        );
    }
    if (!email) {
        messages.push(
            {
                text: "Поле 'почта' обязательно для заполнения!"
            }
        );
    }
    if (!phone) {
        messages.push(
            {
                text: "Поле 'телефон' обязательно для заполнения!"
            }
        );
    }
    if (isRegistry && password && password.length < 6) {
        // this.messages.push({message: "Пароль не должен быть короче 6 символов!"});
        messages.push(
            {
                text: "Пароль не должен быть короче 6 символов!"
            }
        );
    }
    if (isRegistry && password && confirm_password && (password !== confirm_password)) {
        messages.push(
            {
                text: "Пароли не совпадают!"
            }
        );
    }
    if (username && !rightUsername.test(username)) {
        messages.push(
            {
                text: "Никнейм должен состоять только из латинских букв, цифр, символов подчеркивания длиной 3-16 символов!"
            }
        );
    }
    if (isRegistry && password && !rightPassword.test(password)) {
        messages.push(
            {
                text: "Пароль  должен состоять только из латинских букв и цифр, символов подчеркивания и тире!"
            }
        );
    }
    if (phone && !rightPhone.test(phone)) {
        messages.push(
            {
                text: "Неверный формат телефона!"
            }
        );
    }
    if (email && !rightEmail.test(email)) {
        messages.push(
            {
                text: "Неверный формат почты!"
            }
        );
    }
    if (messages.length > 0) {
        throw new UserCredentialsError("Invalid User Credentials", messages);
    }
}


module.exports = {
    validateUserData
}