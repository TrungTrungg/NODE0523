const mongoose = require('mongoose');

const productOrderSchema = new mongoose.Schema({
    product_id: { type: String },
    price: { type: Number },
    quantity: { type: Number },
});

const userOrderSchema = new mongoose.Schema({
    user_id: { type: String },
    address: { type: Number },
    phone: { type: Number },
});

const orderSchema = new mongoose.Schema(
    {
        user_code: {
            type: String,
        },
        status: {
            type: String,
        },
        product: {
            type: productOrderSchema,
        },
        user: {
            type: userOrderSchema,
        },
        total: {
            type: String,
        },
        delivery_fee: {
            type: String,
        },
        coupon_id: {
            type: String,
        },
        shipping_location: {
            type: String,
        },
        message: {
            type: String,
        },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('orders', orderSchema);
