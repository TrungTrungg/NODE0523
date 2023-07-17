const { matchedData } = require('express-validator');

const { couponService, deliveryService, orderService } = require('@services');
const { catchAsync } = require('@helpers');
const { checkoutCollection: collection } = require('@utils');
const { resultsValidator } = require('@validators');

const renderCheckout = catchAsync(async (req, res) => {
    const locations = await deliveryService.getLocations();

    const options = {
        page: 'Trang thanh toán',
        pageDesc: '',
        locations,
        collection,
    };
    res.render('frontend/pages/checkout', options);
});

const checkCoupon = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        res.send({ error: true, message: errors });
    } else {
        const { code: couponCode } = matchedData(req);
        const { id, code, type, value } = await couponService.getOneByCode(couponCode);
        res.send({ success: true, message: 'Đã nhập mã giảm giá', id, code, type, value });
    }
});

const getShippingFee = catchAsync(async (req, res) => {
    const { id } = req.body;
    const { location, shipping_fee } = await deliveryService.getOneById(id);
    res.send({ success: true, id, location, shipping_fee });
});

const create = catchAsync(async (req, res) => {
    const errors = resultsValidator(req);
    if (errors.length > 0) {
        res.send({ error: true, message: errors });
    } else {
        const { fname, lname, email, phone, address, message, products, coupon, delivery } = req.body;
        let result = '';
        let characters = '0123456789';
        for (let i = 0; i < 5; i++) {
            let randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        const user_code = `${fname.charAt(0)}${lname.charAt(0)}-${result}`;
        let productsParse = JSON.parse(products);
        let couponParse = '';
        let couponId = '';
        if (coupon) {
            couponParse = JSON.parse(coupon);
            couponId = couponParse.id;
        }
        const deliveryParse = JSON.parse(delivery);
        let total = 0;
        productsParse = productsParse.map((product) => {
            total += parseInt(product.total);
            return { product_id: product.id, price: product.price, quantity: product.quantity };
        });
        const user = { email, address, phone };
        await orderService.create(
            user_code,
            'chưa thanh toán',
            productsParse,
            user,
            total,
            couponId,
            deliveryParse.id,
            message,
        );
        res.send({ success: true, message: 'Đặt hàng thành công' });
    }
});

module.exports = {
    renderCheckout,
    checkCoupon,
    getShippingFee,
    create,
};
