const rateLimit = require('express-rate-limit');

const config = rateLimit({
    windowMs: 60 * 1000,
    max: 10000,
    handler: (req, res) => {
        res.status(429).json({ success: false, message: 'Too many requests from this IP, please try again later.' });
    }
});

module.exports = config;