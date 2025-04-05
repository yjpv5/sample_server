const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : err.message;

    res.status(statusCode).json({
        success: false,
        error: message
    });
};

module.exports = errorHandler;