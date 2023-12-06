const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    specs: [{
        name: { type: String, required: false },
        options: [{ type: String, required: false }]
    }],
    actived: { type: Boolean, required: true, default: true },
    created: {
        Id: { type: String, required: true, default: 'Init' },
        name: { type: String, required: true, default: 'Init' },
        datetime: { type: Date, required: true, default: Date.now },
    },
    updated: [{
        Id: { type: String, required: true, default: 'Init' },
        name: { type: String, required: true, default: 'Init' },
        datetime: { type: Date, required: true, default: Date.now },
    }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;