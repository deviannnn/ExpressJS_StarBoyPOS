const mongoose = require('mongoose');
const generateId = require('./utils/auto-id');

const categorySchema = new mongoose.Schema({
    categoryId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateId('CAT')
    },
    name: { type: String, required: true },
    theme: { type: mongoose.Schema.Types.ObjectId, ref: 'Theme' },
    status: { type: Number, required: true, default: 1 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;