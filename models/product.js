const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    productId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    img: { type: String, required: true },
    specs: [{
        name: { type: String, required: true },
        option: { type: String, required: true }
    }],
    status: { type: Number, required: true, default: 1 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;