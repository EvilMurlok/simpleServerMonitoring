const {models} = require("../../sequelize");

const user_register_post = async (req, res) => {
    let {username, phone, email, password, confirm_password} = req.body;
    try {
        const user = await models.user.registerUser({username, phone, email, password, confirm_password});
        res.send({
            status: "success",
            user: user,
            messages: [{
                text: `Пользователь ${user.username} успешно зарегистрирован!`
            }]
        });
    } catch (e) {
        res.send({
            status: "danger",
            messages: e.messages
        })
    }
}

// const user_edition = async (req, res) => {
//     let {username, phone, email} = req.body;
//     res.send(models.User.edition({username, phone, email}));
// }

const user_logout = async (req, res) => {
    req.logout();
    res.status(200).send({
        status: "success",
        message: "Вы успешно вышли из системы!",
        isLoggedIn: req.isAuthenticated()
    });
}

module.exports = {
    user_register_post,
    // user_edition,
    user_logout
}