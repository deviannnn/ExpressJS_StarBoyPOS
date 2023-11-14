const mongoose = require('mongoose');
const generateId = require('./utils/auto-id');

const supplierSchema = new mongoose.Schema({
    supplierId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateId('SUP')
    },
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    bankName: { type: String, required: true },
    bankNum: { type: String, required: true },
    status: { type: Number, required: true, default: 1 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;