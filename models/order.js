const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    totalAmount: { type: Number, required: true },
    items: [{
        productColor: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductColor', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        amount: { type: Number, required: true }
    }],
    payment: {
        method: { type: String, required: true, default: 'cash' },
        receive: { type: Number, required: true },
        change: { type: Number, required: true },
        type: { type: String, required: true, default: 'full payment' },
        remainAmount: { type: Number, required: true, default: 0 }
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;