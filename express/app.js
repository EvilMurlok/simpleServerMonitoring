// global requirements
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require("path");

// local routes requirements
const testRouter = require('./routes/testRoutes');
const authRouter = require('./routes/authorization');


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

// connection the bootstrap module
app.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')))

// We create a wrapper to workaround async errors not being transmitted correctly.
// function makeHandlerAwareOfAsyncErrors(handler) {
//     return async function(req, res, next) {
//         try {
//             await handler(req, res);
//         } catch (error) {
//             next(error);
//         }
//     };
// }

app.use('', authRouter);
app.use('', testRouter);

module.exports = app;