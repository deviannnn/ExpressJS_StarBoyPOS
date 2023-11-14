const mongoose = require('mongoose');
const generateId = require('./utils/auto-id');

const accountSchema = new mongoose.Schema({
    staffId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateId('STAR-STAFF')
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, required: true },
    birthday: { type: Date, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    avatar: { type: String, required: true },
    store: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: Number, required: true, default: 0 },
    lock: { type: Boolean, required: true, default: false },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;