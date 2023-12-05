const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    Id: { type: String, unique: true, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    totalAmount: { type: Number, required: true },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant', required: true },
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
        datetime: { type: Date, default: Date.now },
        updatedBy: { type: String, required: true }
    }]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;