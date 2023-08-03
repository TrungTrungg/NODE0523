const { deliveryService } = require('@services');
const { catchAsync } = require('@helpers');
const { cartCollection: collection } = require('@utils');

const renderCart = catchAsync(async (req, res) => {
    const locations = await deliveryService.getLocations();
    const options = {
        title: 'Trang giỏ hàng',
        page: 'Trang giỏ hàng',
        pageDesc: '',
        collection,
        locations,
    };
    res.render('frontend/pages/cart', options);
});

module.exports = {
    renderCart,
};
