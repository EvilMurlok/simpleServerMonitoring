const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const { models } = require("../../sequelize");


const user_register_post = async (req, res) => {
    let { username, password, confirm_password } = req.body;
    let messages = [];
    let [right_username, right_password] = [/^[a-zA-Z0-9_]{3,255}$/, /^[a-zA-Z0-9_-]+/];
    // All required validations
    if ( !username ){
        messages.push(
            {
                type: "error",
                text: "Поле никнейма обязательно для заполнения!"
            }
        );
    }
    if ( !password ){
        messages.push(
            {
                type: "error",
                text: "Поле пароля обязательно для заполнения!"
            }
        );
    }
    if ( !confirm_password ){
        messages.push(
            {
                type: "error",
                text: "Поле 'подтверждения пароля' обязательно для заполнения!\""
            }
        );
    }
    if (password && password.length < 6){
        messages.push(
            {
                type: "error",
                text: "Пароль не должен быть короче 6 символов!"
            }
        );
    }
    if ( password && confirm_password && (password !== confirm_password) ){
        messages.push(
            {
                type: "error",
                text: "Пароли не совпадают!"
            }
        );
    }
    if (username && !right_username.test(username)){
        messages.push(
            {
                type: "error",
                text: "Никнейм должен состоять только из латинских букв и цифр, символов подчеркивания длиной 3-16 символов!"
            }
        );
    }
    if (password && !right_password.test(password)){
        messages.push(
            {
                type: "error",
                text: "Пароль  должен состоять только из латинских букв и цифр, символов подчеркивания и тире!"
            }
        );
    }
    if (messages.length > 0) {
        res.send({
           messages: messages,
           status: "danger"
        });
    }
    else{
        // Check if the user with such email exists
        const user = await models.user.findOne({
            where: {
                username: {
                    [Op.eq]: username
                }
            }
        });
        if (user){
            messages.push(
                {
                    type: "error",
                    text: "Пользователь с таким никнеймом уже существует!"
                }
            );
            res.send({
                messages: messages,
                status: "danger"
            });
        }else {
            let hashedPassword = await bcrypt.hash(password, 10);
            // insertion the new user
            await models.user.create({
                username: username,
                password: hashedPassword
            });
            res.send({
                status: "success",
                message: {
                    type: 'success',
                    text: `Пользователь ${username} успешно зарегистрирован!`
                }
            });
        }
    }
}


const user_logout = async (req, res) => {
    req.logout();
    res.status(200).send({
        status: "success",
        message: "Вы успешно вышли из системы!",
        isLoggedIn: req.isAuthenticated()
    });
}

module.exports = {
    // user_register,
    user_register_post,
    // user_login,
    user_logout
}