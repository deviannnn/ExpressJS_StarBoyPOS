const mongoose = require('mongoose');

const productColorSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    barcode: { type: String, unique: true, required: true },
    img: { type: String, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: Number, required: true, default: 1 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const ProductColor = mongoose.model('ProductColor', productColorSchema);

module.exports = ProductColor;