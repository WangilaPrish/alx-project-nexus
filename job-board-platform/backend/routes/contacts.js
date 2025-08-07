const express = require('express');
const rateLimit = require('express-rate-limit');
const {
    submitContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
    getContactStats
} = require('../controllers/contactController');
const { validateContact, sanitizeInput } = require('../middleware/validation');
const { addClientInfo } = require('../middleware/helpers');

const router = express.Router();

// Rate limiting for contact form submissions
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 contact requests per windowMs
    message: {
        success: false,
        message: 'Too many contact submissions. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Public routes
router.post('/', 
    contactLimiter, 
    addClientInfo, 
    sanitizeInput, 
    validateContact, 
    submitContact
);

// Admin routes (these would typically require authentication middleware)
router.get('/', getAllContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContactById);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

module.exports = router;
