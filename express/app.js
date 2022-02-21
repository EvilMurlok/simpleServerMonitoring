const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const testRouter = require('./routes/testRoutes');

// var usersRouter = require('./Routes/users.routes');
// var adminRouter = require('./Routes/admin.routes');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// We create a wrapper to workaround async errors not being transmitted correctly.
function makeHandlerAwareOfAsyncErrors(handler) {
    return async function(req, res, next) {
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
}

app.use('/test/', testRouter);


// Тут будут все роутинги для каждого боъекта
// app.use('/users', usersRouter);
// app.use('/admin', adminRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(err.status || 404).json({
        message: "No such route exists"
    })
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
        message: "Fatal Error"
    })
});

module.exports = app;