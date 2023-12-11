const createError = require('http-errors');
const { extractToken, decodeToken } = require('../utils/jwt');

const authenticate = async (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return next(createError(401));
    }

    try {
        const decoded = await decodeToken(token);
        req.user = decoded;
        return next();
    } catch (error) {
        return next(createError(401));
    }
}

const isLoggedIn = (req, res, next) => {
    if (req.user && req.source === 'login') {
        next();
    } else {
        next(createError(403));
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        next(createError(403));
    }
};

module.exports = { authenticate, isLoggedIn, isAdmin };