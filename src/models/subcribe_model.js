const mongoose = require('mongoose');

const subcribeSchema = new mongoose.Schema(
    {
        email: { type: String },
        status: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('subcribes', subcribeSchema);
