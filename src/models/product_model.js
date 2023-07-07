const mongoose = require('mongoose');

const specificSchema = new mongoose.Schema({
    size: { type: String },
    ram: { type: String },
    vga: { type: String },
    ssd: { type: String },
    cpu: { type: String },
});

const specialShowhome = new mongoose.Schema({
    special: { type: Boolean, default: false },
    showHome: { type: Boolean, default: false },
});

const productSchema = new mongoose.Schema(
    {
        name: { type: String },
        status: { type: String },
        ordering: { type: Number },
        slug: { type: String },
        specialShowhome: { type: specialShowhome },
        image: { type: String },
        gallery_image: { type: [String] },
        price: { type: Number },
        quantity: { type: Number },
        sold: { type: Number },
        sale: { type: Number, default: 0 },
        description: { type: String },
        specification: { type: specificSchema },
        category_id: { type: String },
        brand_id: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('products', productSchema);
