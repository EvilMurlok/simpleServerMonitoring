// global requirements
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require("path");
const session = require("express-session");
const flash = require('express-flash');
const passport = require('passport');

// local routes requirements
const testRouter = require('./routes/testRoutes');
const authRouter = require('./routes/authorization');
const { SESSION_SECRET } = require('../config/session.conf');
const initializePassport = require('./passportConfig');

const app = express();


// templating setup
app.set('views', path.join(__dirname, './views'));
app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});

// using the middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000,  secure: false }
    })
);
app.use(passport.initialize({}));
// Store our variables to be persisted across the whole session.
// Works with app.use(Session) above
app.use(passport.session({}));
app.use(flash());

// include all routes
app.use('', authRouter);
app.use('', testRouter);

initializePassport(passport);

module.exports = app;