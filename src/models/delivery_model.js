const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
    {
        location: { type: String },
        status: { type: String },
        shipping_fee: { type: Number },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('delivery', deliverySchema);
