const { orderService } = require('@services');
const { catchAsync } = require('@helpers');
const { userCollection: collection } = require('@utils');

const renderUserInfo = catchAsync(async (req, res) => {
    const { email } = req.app.locals.user;
    const orders = await orderService.getOrdersByUser(email);
    const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
    };
    const options = { page: 'Trang cá nhân', pageDesc: '', collection, orders, messages };
    res.render('frontend/pages/user', options);
});
const renderUserOrder = catchAsync(async (req, res) => {
    const options = {};
    res.render('frontend/pages/user/order', options);
});
module.exports = {
    renderUserInfo,
};
