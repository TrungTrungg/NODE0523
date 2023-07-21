const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
        },
        type: {
            type: String,
        },
        value: {
            type: Number,
        },
        started_at: {
            type: Date,
        },
        expired_at: {
            type: Date,
        },
        quantity: {
            type: Number,
        },
        condition: {
            type: String,
        },
        used: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('coupons', couponSchema);
