const { articleService, categoryService } = require('@services');
const { catchAsync } = require('@helpers');
const { cartCollection: collection } = require('@utils');

const renderCart = catchAsync(async (req, res) => {
    const options = {
        page: 'Trang giỏ hàng',
        pageDesc: '',
        collection,
    };
    res.render('frontend/pages/cart', options);
});

module.exports = {
    renderCart,
};
