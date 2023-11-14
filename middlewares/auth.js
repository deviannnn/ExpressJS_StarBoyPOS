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

module.exports = authenticate;