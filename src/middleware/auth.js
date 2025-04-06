const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const authJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const error = new Error('No Token, please login!');
        error.statusCode = 401;
        return next(error);
    }

    const tokenSplit = authHeader.split(' ');
    if (tokenSplit.length !== 2 || tokenSplit[0] !== 'Bearer') {
        const error = new Error('Invalid token format. Please Use Bearer.');
        error.statusCode = 401;
        return next(error);
    }
    const token = tokenSplit[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        error.statusCode = 401;
        return next(error);
    }
}

module.exports = { authJWT };