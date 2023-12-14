const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    Id: { type: String, unique: true, required: true },
    customer: {
        Id: { type: String, unique: true, required: true, default: 'WG' },
        name: { type: String, unique: true, required: true, default: 'Walk-in Guest' }
    },
    cashier: {
        Id: { type: String, unique: true, required: true },
        name: { type: String, unique: true, required: true }
    },
    summaryAmount: {
        subTotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        voucher: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true }
    },
    items: [{
        product: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        amount: { type: Number, required: true }
    }],
    payment: {
        method: { type: String, required: true, enum: ['cash', 'banking'], default: 'cash' },
        receive: { type: Number, required: true },
        change: { type: Number, required: true },
        type: { type: String, required: true, enum: ['full payment', 'installment'], default: 'full payment' },
        remainAmount: { type: Number, required: true, default: 0 }
    },
    created: { type: Date, default: Date.now },
    updated: [{
        Id: { type: String, required: true },
        name: { type: String, required: true },
        datetime: { type: Date, required: true, default: Date.now },
    }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;