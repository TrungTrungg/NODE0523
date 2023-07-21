const mongoose = require('mongoose');

const productOrderSchema = new mongoose.Schema({
    product_id: { type: String },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
});

const userOrderSchema = new mongoose.Schema({
    email: { type: String },
    address: { type: String },
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
            type: [productOrderSchema],
        },
        user: {
            type: userOrderSchema,
        },
        total: {
            type: String,
        },
        coupon_id: {
            type: String,
        },
        delivery_id: {
            type: String,
        },
        message: {
            type: String,
        },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('orders', orderSchema);
