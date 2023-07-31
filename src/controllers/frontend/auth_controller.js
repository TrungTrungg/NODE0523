const { matchedData } = require('express-validator');
const { userService: service } = require('@services');
const { catchAsync, mailHelper } = require('@helpers');
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
        res.send({ success: true, message: notify.SUCCESS_USER_REGISTER });
    }
});
const login = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        res.send({ error: true, message: notify.ERROR_USER_LOGIN });
    } else {
        const { email } = matchedData(req);
        const { id } = await service.getOne(email);
        const token = jwt.sign({ id }, process.env.SECRET_KEY, {
            expiresIn: process.env.TOKEN_EXPIRES,
        });
        res.cookie('jwt', token);
        req.flash('success', notify.SUCCESS_USER_LOGIN);
        res.send({ success: true, message: notify.SUCCESS_USER_LOGIN });
    }
});

const logout = catchAsync(async (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
});

const resetPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const user = await service.getOne(email);
    if (user) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@_&^%$#!*()';
        for (let i = 0; i < 8; i++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        user.password = result;
        await user.save();
        mailHelper.sendMail(email, 'Mật khẩu reset', `<h1>Mật khẩu mới của bạn là:</h1> ${result}`);
        res.send({ success: true, message: 'Mật khẩu mới đã được gửi về mail của bạn' });
    } else {
        res.send({ error: true, message: 'Email này chưa được đăng ký' });
    }
});

const changeInfo = catchAsync(async (req, res) => {
    const { email, fname, lname, address, phone } = req.body;
    await service.updateUserInfo(email, fname, lname, address, phone);
    req.flash('success', 'Chỉnh sửa thông tin thành công!');
    res.send({ success: true, message: 'Chỉnh sửa thông tin thành công!' });
});

const changePassword = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        res.send({ error: true, message: errors });
    } else {
        const { password } = matchedData(req);
        if (req.app.locals.user) {
            const user = await service.getOne(req.app.locals.user.email);
            user.password = password;
            await user.save();
            res.send({ success: true, message: 'Đổi mật khẩu thành công!' });
        }
    }
});
module.exports = {
    renderRegisterLogin,
    register,
    login,
    logout,
    resetPassword,
    changeInfo,
    changePassword,
};
