const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String },
        ordering: { type: Number },
        slug: { type: String },
        image: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('categories', categorySchema);
