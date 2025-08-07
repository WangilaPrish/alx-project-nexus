const express = require('express');
const rateLimit = require('express-rate-limit');
const {
    register,
    login,
    googleAuth,
    getProfile,
    updateProfile,
    logout,
    getUserStats
} = require('../controllers/authController');
const {
    validateRegister,
    validateLogin,
    validateGoogleAuth,
    validateProfileUpdate
} = require('../middleware/authValidation');
const { authenticateToken } = require('../middleware/auth');
const { addClientInfo } = require('../middleware/helpers');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 auth requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Stricter rate limiting for registration
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 registration attempts per hour
    message: {
        success: false,
        message: 'Too many registration attempts. Please try again in 1 hour.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Public auth routes
router.post('/register',
    registerLimiter,
    addClientInfo,
    validateRegister,
    register
);

router.post('/login',
    authLimiter,
    addClientInfo,
    validateLogin,
    login
);

router.post('/google',
    authLimiter,
    addClientInfo,
    validateGoogleAuth,
    googleAuth
);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getProfile);
router.patch('/profile', authenticateToken, validateProfileUpdate, updateProfile);
router.post('/logout', authenticateToken, logout);

// Admin routes (these would typically require admin authentication middleware)
router.get('/stats', getUserStats);

module.exports = router;
