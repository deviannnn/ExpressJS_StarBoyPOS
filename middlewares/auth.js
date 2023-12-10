const { extractToken, decodeToken } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - Missing token' });
    }

    try {
        const decoded = await decodeToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized - ' + error.message });
    }
}

const isLoggedIn = (req, res, next) => {
    if (req.user && req.source === 'login') {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'Forbidden - You are not logged in.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'Forbidden - Admin access required.' });
    }
};

module.exports = { authenticate, isLoggedIn, isAdmin };