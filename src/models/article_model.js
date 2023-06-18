const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
    {
        name: { type: String },
        author: { type: String },
        status: { type: String },
        ordering: { type: Number },
        slug: { type: String },
        image: { type: String },
        description: { type: String },
        post_date: { type: Date },
        category_id: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('articles', articleSchema);
