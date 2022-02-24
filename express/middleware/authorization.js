const checkAuthenticated = (req, res, next) => {
    console.log("checkAuthenticated", req.isAuthenticated())
    if (!req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Вы уже вошли в систему!");
    res.redirect("/index");
}

const checkNotAuthenticated = (req, res, next) => {
    console.log("checkNotAuthenticated", req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Для посещения этой страницы необходима авторизация!");
    res.redirect("/login");
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}