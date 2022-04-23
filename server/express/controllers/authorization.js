const {models} = require("../../sequelize");

const {UserNotUpdatedDataError} = require("../../sequelize/errors/user/userExceptions");
const {PermissionSameCredentialsError} = require("../../sequelize/errors/permission/permissionErrors");

const user_register_post = async (req, res) => {
    let {username, phone, email, password, confirm_password} = req.body;
    try {
        const createdUser = await models.user.registerUser({username, phone, email, password, confirm_password});
        res.send({
            status: "success",
            user: createdUser,
            messages: [{
                text: `Пользователь ${createdUser.username} успешно зарегистрирован!`
            }]
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const user_edition = async (req, res) => {
    let {username, phone, email} = req.body;
    const userId = req.user.id;
    try {
        const [, updatedUser] = await models.user.editUser({username, phone, email, userId});
        res.send({
            status: "success",
            user: updatedUser,
            messages: [{
                text: `Пользователь ${updatedUser.username} успешно отредактирован!`
            }]
        });
    } catch (e) {
        if (e instanceof UserNotUpdatedDataError) {
            res.send({
                status: "info",
                messages: e.messages
            })
        } else {
            res.send({
                status: "warning",
                messages: e.messages
            });
        }
    }
}

const user_change_password = async (req, res) => {
    const userId = req.user.id;
    const {currentPassword, newPassword, confirmNewPassword} = req.body;
    try {
        const updatedUser = await models.user.changePassword({
            userId,
            currentPassword,
            newPassword,
            confirmNewPassword
        });
        res.send({
            updatedUser: updatedUser,
            status: "success",
            messages: [{
                text: "Пароль успешно изменен!"
            }]
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const user_retrieve = async (req, res) => {
    const userId = req.user.id;
    try {
        const requiredUser = await models.user.retrieveUser({userId});
        res.send({
            status: "success",
            user: requiredUser,
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const user_deletion = async (req, res) => {
    const userId = req.user.id;
    try {
        const numberDeletedUsers = await models.user.deletionUser({userId});
        req.logout();
        res.send({
            numberDeletedUsers: numberDeletedUsers,
            status: "success",
            messages: [{text: "Пользователь успешно удален!"}]
        });
    } catch (e) {
        res.send({
            status: "warning",
            messages: e.messages
        });
    }
}

const user_logout = async (req, res) => {
    const username = req.user.username;
    req.logout();
    res.send({
        status: "success",
        messages: [{
            text: "Вы успешно вышли из системы!"
        }],
        username: username
    });
}

module.exports = {
    user_register_post,
    user_edition,
    user_change_password,
    user_logout,
    user_retrieve,
    user_deletion
}