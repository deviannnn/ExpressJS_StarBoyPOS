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
    timeline: [{
        quantity: { type: Number, required: true },
        action: { type: String, enum: ['sell', 'import'], required: true },
        datetime: { type: Date, default: Date.now }
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

const Variant = mongoose.model('Variant', variantSchema);

module.exports = Variant;