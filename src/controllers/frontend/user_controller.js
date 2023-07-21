const { orderService } = require('@services');
const { catchAsync } = require('@helpers');

const renderUserInfo = catchAsync(async (req, res) => {
    const { email } = req.app.locals.user;
    const orders = await orderService.getOrdersByUser(email);
    const options = { orders };
    res.render('frontend/pages/user', options);
});
const renderUserOrder = catchAsync(async (req, res) => {
    const options = {};
    res.render('frontend/pages/user/order', options);
});
module.exports = {
    renderUserInfo,
};
