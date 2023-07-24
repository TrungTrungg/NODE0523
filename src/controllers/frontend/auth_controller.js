const { matchedData } = require('express-validator');
const { userService: service } = require('@services');
const { catchAsync } = require('@helpers');
const { userCollection: collection, notify } = require('@utils');
const { resultsValidator } = require('@validators');
const jwt = require('jsonwebtoken');

const renderRegisterLogin = catchAsync(async (req, res) => {
    if (req.app.locals.user) res.redirect('/');
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = {
        page: 'Trang đăng ký - đăng nhập',
        pageDesc: '',
        collection,
        messages,
    };

    res.render('frontend/pages/auth/register_login', options);
});
const register = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        res.send({ error: true, message: errors });
    } else {
        const { fname, lname, address, email, phone, password } = matchedData(req);
        await service.create(fname, lname, address, email, phone, password);
        res.send({ success: true, message: notify.SUCCESS_CHANGE_ORDERING });
    }
});
const login = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        res.send({ error: true, message: 'Tài khoản hoặc mật khẩu không đúng' });
    } else {
        const { email } = matchedData(req);
        const { id } = await service.getOne(email);
        const token = jwt.sign({ id }, process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_EXPIRES,
        });
        res.cookie('jwt', token);
        req.flash('success', notify.SUCCESS_ADD);
        res.send({ success: true, message: 'OK!' });
    }
});

const logout = catchAsync(async (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
});

module.exports = {
    renderRegisterLogin,
    register,
    login,
    logout,
};
