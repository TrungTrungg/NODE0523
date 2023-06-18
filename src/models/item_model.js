const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
    {
        name: { type: String },
        status: { type: String },
        ordering: { type: Number },
        slug: { type: String },
        image: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('items', itemSchema);
