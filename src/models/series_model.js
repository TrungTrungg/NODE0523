const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema(
    {
        name: { type: String },
        status: { type: String },
        ordering: { type: Number },
        slug: { type: String },
        url: { type: String },
        category_id: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('series', seriesSchema);