const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
    {
        name: { type: String },
        slug: { type: String },
        author: { type: String },
        status: { type: String },
        is_special: { type: Boolean, default: false },
        ordering: { type: Number },
        image: { type: String },
        description: { type: String },
        content: { type: String },
        category_id: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('articles', articleSchema);
