const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    bankName: { type: String, required: true },
    bankNum: { type: String, required: true },
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

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;