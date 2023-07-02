const mongoose = require('mongoose');

const subscribeSchema = new mongoose.Schema(
    {
        email: { type: String },
        status: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('subscribes', subscribeSchema);
