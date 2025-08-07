// Get client IP address
const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null);
};

// Get user agent
const getUserAgent = (req) => {
    return req.headers['user-agent'] || 'Unknown';
};

// Middleware to add client info to request
const addClientInfo = (req, res, next) => {
    req.clientIP = getClientIP(req);
    req.userAgent = getUserAgent(req);
    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = {
        message: 'Internal server error',
        status: 500
    };

    // Handle different types of errors
    if (err.name === 'ValidationError') {
        error.message = err.message;
        error.status = 400;
    } else if (err.code === 'ER_DUP_ENTRY') {
        error.message = 'Duplicate entry found';
        error.status = 409;
    } else if (err.code === 'ER_NO_SUCH_TABLE') {
        error.message = 'Database table not found';
        error.status = 500;
    } else if (err.message) {
        error.message = err.message;
    }

    res.status(error.status).json({
        success: false,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// 404 handler
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
};

module.exports = {
    addClientInfo,
    errorHandler,
    notFound
};
