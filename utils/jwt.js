const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

const generateJWT = async (account) => {
    try {
        const token = await jwt.sign(
            {
                Id: account.Id,
                email: account.email,
                name: account.profile.name,
                role: account.role
            },
            secretKey,
            {
                algorithm: 'HS256',
                expiresIn: '1h',
            }
        );
        return token;
    } catch (error) {
        console.error('Error generating JWT:', error.message);
        throw error;
    }
};

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return (req.query).token;
    }
    return null;
}

const decodeToken = async (token) => {
    try {
        return await jwt.verify(token, secretKey);
    } catch (error) {
        console.error('Error decoding token:', error.message);
        throw error;
    }
};

module.exports = { generateJWT, extractToken, decodeToken };