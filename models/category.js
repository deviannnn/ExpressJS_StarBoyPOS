const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    specs: [{
        name: { type: String, required: false },
        option: { type: String, required: false }
    }],
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

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;