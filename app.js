require('module-alias/register');

const createError = require('http-errors');
const express = require('express');
const nodemailer = require('nodemailer');

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
// const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');

const router = require('@routes');

const app = express();
// connect mongodb
const mongoDBUrl = 'mongodb+srv://xuantrung:xuantrung@cluster0.wppcclt.mongodb.net/';

mongoose
    .connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Kết nối thành công đến MongoDB!');
    })
    .catch((error) => {
        console.error('Lỗi kết nối đến MongoDB:', error);
    });

// use express flash
app.use(
    session({
        secret: 'abcz',
        resave: false,
        saveUninitialized: true,
    }),
);

app.use(flash());

// use express layout
app.use(expressLayouts);
app.set('layout', 'backend/index');

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// get url
app.use((req, res, next) => {
    app.locals.currentUrl = req.path;
    next();
});
// router
app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
