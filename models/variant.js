const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    img: { type: String, required: true },
    barcode: { type: String, unique: true, required: true },
    color: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    warn: { type: Number, required: false },
    status: {
        type: String,
        required: true,
        enum: ['new', 'in stock', 'out of stock', 'warning'],
        default: 'new'
    },
    quantityHistory: [{
        datetime: { type: Date, default: Date.now },
        quantity: { type: Number, required: true },
        updatedBy: { type: String, enum: ['sell', 'import'], required: true }
    }],
    actived: { type: Boolean, required: true, default: true },
    created: {
        Id: { type: String, required: true, default: 'Init' },
        name: { type: String, required: true, default: 'Init' },
        datetime: { type: Date, required: true, default: Date.now },
    },
    updated: [{
        Id: { type: String, required: true, default: 'Init' },
        name: { type: String, required: true, default: 'Init' },
        datetime: { type: Date, required: true, default: Date.now },
    }]
});

const Variant = mongoose.model('Variant', variantSchema);

module.exports = Variant;