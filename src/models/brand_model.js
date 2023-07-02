const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
    {
        name: { type: String },
        slug: { type: String },
        status: { type: String },
        ordering: { type: String },
        is_special: { type: Boolean, default: false },
        image: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('brands', brandSchema);
