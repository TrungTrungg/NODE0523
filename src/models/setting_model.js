const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
    {
        setting: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('settings', settingSchema);
