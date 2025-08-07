const Joi = require('joi');

// Contact form validation schema
const contactSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 255 characters',
            'any.required': 'Name is required'
        }),
    
    email: Joi.string()
        .email()
        .max(255)
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.max': 'Email cannot exceed 255 characters',
            'any.required': 'Email is required'
        }),
    
    subject: Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            'string.min': 'Subject must be at least 5 characters long',
            'string.max': 'Subject cannot exceed 500 characters',
            'any.required': 'Subject is required'
        }),
    
    message: Joi.string()
        .min(10)
        .max(5000)
        .required()
        .messages({
            'string.min': 'Message must be at least 10 characters long',
            'string.max': 'Message cannot exceed 5000 characters',
            'any.required': 'Message is required'
        })
});

// Middleware to validate contact form data
const validateContact = (req, res, next) => {
    const { error } = contactSchema.validate(req.body);
    
    if (error) {
        const errorMessage = error.details[0].message;
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            error: errorMessage
        });
    }
    
    next();
};

// Middleware to sanitize input data
const sanitizeInput = (req, res, next) => {
    if (req.body.name) {
        req.body.name = req.body.name.trim();
    }
    if (req.body.email) {
        req.body.email = req.body.email.trim().toLowerCase();
    }
    if (req.body.subject) {
        req.body.subject = req.body.subject.trim();
    }
    if (req.body.message) {
        req.body.message = req.body.message.trim();
    }
    
    next();
};

module.exports = {
    validateContact,
    sanitizeInput
};
