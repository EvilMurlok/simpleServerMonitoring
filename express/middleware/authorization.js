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
    // req.flash("error", "Вы уже вошли в систему!");
    // res.redirect("http://localhost:8081/#/show-servers");
}

const checkNotAuthenticated = (req, res, next) => {
    console.log("checkNotAuthenticated", req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    }
    res.send({
        message: "Для посещения этой страницы необходима авторизация!",
        status: "danger",
        isLoggedIn: req.isAuthenticated()
    });
    // req.flash("error", "Для посещения этой страницы необходима авторизация!");
    // res.redirect("http://localhost:8081/#/login");
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}