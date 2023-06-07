const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        name: { type: String },
        status: { type: String },
        ordering: { type: Number },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('items', itemSchema);
