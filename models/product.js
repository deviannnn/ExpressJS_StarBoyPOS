const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    specs: [{
        name: { type: String, required: false },
        option: { type: String, required: false }
    }],
    actived: { type: Boolean, required: true, default: true },
    created: {
        Id: { type: String, required: true },
        name: { type: String, required: true },
        datetime: { type: Date, required: true, default: Date.now },
    },
    updated: [{
        Id: { type: String, required: true },
        name: { type: String, required: true },
        datetime: { type: Date, required: true, default: Date.now },
    }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;