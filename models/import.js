const mongoose = require('mongoose');

const importSchema = new mongoose.Schema({
    totalAmount: { type: Number, required: true },
    receive: { type: Boolean, required: true, default: false },
    note: { type: String },
    details: [{
        productColor: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductColor', required: true },
        supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
        quantity: { type: Number, required: true },
        cost: { type: Number, required: true },
        amount: { type: Number, required: true }
    }],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Import = mongoose.model('Import', importSchema);

module.exports = Import;