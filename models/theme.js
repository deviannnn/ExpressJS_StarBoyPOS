const mongoose = require('mongoose');
const generateId = require('./utils/auto-id');

const themeSchema = new mongoose.Schema({
    themeId: {
        type: String,
        unique: true,
        required: true,
        default: () => generateId('THE')
    },
    name: { type: String, required: true },
    specs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specs' }],
    status: { type: Number, required: true, default: 1 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;