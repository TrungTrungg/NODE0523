const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema(
    {
        name: { type: String },
        status: { type: String },
        ordering: { type: String },
        description: { type: String },
        url: { type: String },
        image: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('sliders', sliderSchema);
