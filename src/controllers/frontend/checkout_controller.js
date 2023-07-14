const { articleService, categoryService } = require('@services');
const { catchAsync } = require('@helpers');
const { checkoutCollection: collection } = require('@utils');

const renderCheckout = catchAsync(async (req, res) => {
    const options = {
        page: 'Trang thanh toán',
        pageDesc: '',
        collection,
    };
    res.render('frontend/pages/checkout', options);
});

module.exports = {
    renderCheckout,
};
