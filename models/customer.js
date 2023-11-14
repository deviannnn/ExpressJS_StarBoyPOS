const mongoose = require('mongoose');
const generateId = require('./utils/auto-id');

const customerSchema = new mongoose.Schema({
    customerId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateId('STAR-CUS')
    },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    points: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;