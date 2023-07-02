const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String },
        status: { type: String },
        ordering: { type: Number },
        slug: { type: String },
        special: { type: String },
        image: { type: String },
        gallery_image: { type: [String] },
        price: { type: Number },
        quantity: { type: Number },
        sold: { type: Number },
        sale: { type: Number },
        description: { type: String },
        specification: { type: [String] },
        category_id: { type: String },
        brand_id: { type: String },
    },
    { timestamps: true },
);

module.exports = new mongoose.model('products', productSchema);
