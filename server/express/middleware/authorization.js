const checkAuthenticated = (req, res, next) => {
    console.log("checkAuthenticated", req.isAuthenticated())
    if (!req.isAuthenticated()) {
        return next();
    }
    res.send({
        message: "Вы уже вошли в систему!",
        status: "danger",
        isLoggedIn: req.isAuthenticated()
    });
}

const checkNotAuthenticated = (req, res, next) => {
    console.log("checkNotAuthenticated", req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    }
    res.send({
        message: "Для посещения этой страницы необходима авторизация! Возможные причины: сессия устарела (авторизуйтесь заново) ИЛИ вы не вошли на сайт",
        status: "danger",
        isLoggedIn: req.isAuthenticated()
    });
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}