const mongoose = require('mongoose');
const generateId = require('./utils/auto-id');

const specsSchema = new mongoose.Schema({
    specsId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateId('SPE')
    },
    name: { type: String, required: true },
    options: [{ type: String, required: true }],
    status: { type: Number, required: true, default: 1 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Specs = mongoose.model('Specs', specsSchema);

module.exports = Specs;