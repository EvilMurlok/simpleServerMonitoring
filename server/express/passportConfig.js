const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const {Op} = require("sequelize");

const {models} = require("../sequelize");

function initialize(passport) {
    const authenticateUser = (username, password, done) => {
        models.user.findOne({
            where: {username: username},
            include: {
                model: models.permission,
                required: false,
                attributes: ["id", "name"],
                through: {attributes: []},
                include: {
                    model: models.ability,
                    required: true,
                    attributes: ["id", "entity", "action", "detail"],
                    through: {attributes: []}
                }
            }
        }).then(function (user) {
                if (!user) {
                    return done(null, false, {message: 'Пользователя с таким никнеймом не существует!'});
                } else {
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log(err);
                        }
                        if (isMatch) {
                            return done(null, user.get());
                        } else {
                            return done(null, false, {message: "Неправильный пароль!"});
                        }
                    });
                }
            }
        );
    };

    passport.use("local",
        new LocalStrategy(
            {usernameField: "username", passwordField: "password"},
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => {
        console.log("serializeUser");
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        models.user.findOne({
            where: {id: id},
            attributes: ["id", "username", "phone", "email"],
            include: {
                model: models.permission,
                required: false,
                attributes: ["id", "name"],
                through: {attributes: []},
                include: {
                    model: models.ability,
                    required: true,
                    attributes: ["id", "entity", "action", "detail"],
                    through: {attributes: []}
                }
            }
        }).then(function (user) {
            if (user) {
                console.log("deserializeUser");
                done(null, user.get());
            } else {
                done("No such user!", null);
            }
        });
    });
}

module.exports = initialize;