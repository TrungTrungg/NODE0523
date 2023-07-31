const mongoose = require('mongoose');

const advertiseSchema = new mongoose.Schema(
    {
        name: { type: String },
        image: { type: String },
        url: { type: String },
        position: { type: String },
        status: { type: String },
        started_at: { type: Date },
        expired_at: { type: Date },
        click_number: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('advertises', advertiseSchema);
