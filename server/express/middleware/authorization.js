const checkAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.send({
        messages: [{
            text: "Вы уже вошли в систему!"
        }],
        status: "warning",
        isLoggedIn: req.isAuthenticated()
    });
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send({
        messages: [{
            text: "Для посещения этой страницы необходима авторизация! Возможные причины: сессия устарела (авторизуйтесь заново) ИЛИ вы не вошли на сайт"
        }],
        status: "warning",
        isLoggedIn: req.isAuthenticated()
    });
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}