const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String },
        status: { type: String },
        ordering: { type: Number },
        slug: { type: String },
        url: { type: String },
        isMenu: { type: Boolean, default: false },
        category_id: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('categories', categorySchema);
