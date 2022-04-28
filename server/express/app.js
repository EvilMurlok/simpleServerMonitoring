// global requirements
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

// local routes requirements
const testRouter = require("./routes/monitoring");
const authRouter = require("./routes/authorization");
const userRouter = require("./routes/user");
const serverRouter = require("./routes/server");
const projectRouter = require("./routes/project");
const tagRouter = require("./routes/tag");
const permissionRouter = require("./routes/permission");
const abilityRouter = require("./routes/ability");
const dashboardRouter = require("./routes/dashboard");

// local auth requirements
const {SESSION_SECRET} = require("../config/session.conf");
const initializePassport = require("./passportConfig");

// local monitoring requirements
const {monitoringMiddleware} = require("./middleware/monitoring");

const app = express();

const allowCrossDomain = function (req, res, next) {
    // res.header('Access-Control-Allow-Origin', 'http://159.223.42.191:8080');
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "origin, content-type, accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
}
app.use(allowCrossDomain);

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {maxAge: 3600000, secure: false}
    })
);
app.use(passport.initialize({}));
// Store our variables to be persisted across the whole session.
// Works with app.use(Session) above
app.use(passport.session({}));
initializePassport(passport);

// using the middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

// only some test routes which shouldn't be taken into account
app.use('', testRouter);

// this middleware will help us to calculate different metrics with requests
app.use(monitoringMiddleware);

// include all routes
app.use('', authRouter);
app.use('', userRouter);
app.use('', serverRouter);
app.use('', projectRouter);
app.use('', tagRouter);
app.use('', permissionRouter);
app.use('', abilityRouter);
app.use('', dashboardRouter);

module.exports = app;