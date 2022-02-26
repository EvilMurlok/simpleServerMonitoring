const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const { models } = require("../../sequelize");

// // Rendering "/index" view file
// const index = async (req, res) => {
//     res.render("index.twig", {
//         isAuth: req.isAuthenticated(),
//         name: req.user.username,
//         title: "Your servers"
//     });
// };

const user_register = async (req, res) => {
    res.render("./auth/register-user.twig");
}

const user_register_post = async (req, res) => {
    let { username, user_password, confirm_password } = req.body;
    let messages = [];
    let [right_username, right_password] = [/^[a-zA-Z0-9_]{3,16}$/, /^[a-zA-Z0-9_-]+/];
    // All required validations
    if ( !username ){
        messages.push({ message: "Поле никнейма обязательно для заполнения!"});
    }
    if ( !user_password ){
        messages.push({ message: "Поле пароля обязательно для заполнения!"});
    }
    if ( !confirm_password ){
        messages.push({ message: "Поле 'подтверждения пароля' обязательно для заполнения!"});
    }
    if (user_password && user_password.length < 6){
        messages.push({ message: "Пароль не должен быть короче 6 символов!" });
    }
    if ( user_password && confirm_password && (user_password !== confirm_password) ){
        messages.push({ message: "Пароли не совпадают!" });
    }
    if (username && !right_username.test(username)){
        messages.push({ message: "Никнейм должен состоять только из латинских букв и цифр, символов подчеркивания длиной 3-16 символов!" });
    }
    if (user_password && !right_password.test(user_password)){
        messages.push({ message: "Пароль  должен состоять только из латинских буквы и цифр, символов подчеркивания и тире!"});
    }
    if (messages.length > 0) {
        res.render("./auth/register-user.twig", { info: messages, username, status: "danger" });
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
            messages.push({ message: "Пользователь с таким никнеймом уже существует!"});
            res.render("./auth/register-user.twig", { info: messages, username, status: "danger" });
        }else {
            let hashedPassword = await bcrypt.hash(user_password, 10);
            // insertion the new user
            await models.user.create({
                username: username,
                password: hashedPassword
            });
            req.flash("success_msg", `Пользователь ${username} успешно зарегистрирован!`);
            res.status(201).redirect("/login/");
        }
    }
}

const user_login = async (req, res) => {
    res.render("./auth/login-user.twig");
}

const user_logout = async (req, res) => {
    req.flash("success_msg", `Пользователь ${req.user.username} успешно разлогинен!`);
    req.logout();
    res.redirect('/login/');
}

module.exports = {
    user_register,
    user_register_post,
    user_login,
    user_logout
}