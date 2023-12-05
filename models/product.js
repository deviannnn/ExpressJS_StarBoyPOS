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
        datetime: { type: Date, default: Date.now },
        createdBy: { type: String, required: true }
    },
    updated: [{
        datetime: { type: Date, default: Date.now },
        updatedBy: { type: String, required: true }
    }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;