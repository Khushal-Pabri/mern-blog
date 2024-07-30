const jwt = require('jsonwebtoken');
const { secret } = require('../configs/enviroment');

const authMiddleware = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return res.status(401).json('Unauthorized');
    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json('Unauthorized');
        req.user = user;
        next();
    });
};

module.exports = authMiddleware;
