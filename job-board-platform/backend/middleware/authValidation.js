const Joi = require('joi');

// User registration validation schema
const registerSchema = Joi.object({
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

    password: Joi.string()
        .min(6)
        .max(128)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long',
            'string.max': 'Password cannot exceed 128 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            'any.required': 'Password is required'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Password confirmation is required'
        })
});

// User login validation schema
const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// Google auth validation schema
const googleAuthSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    provider_id: Joi.string()
        .required(),

    avatar: Joi.string()
        .uri()
        .allow('', null)
        .optional()
});

// Profile update validation schema
const updateProfileSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .optional(),

    avatar: Joi.string()
        .uri()
        .allow('', null)
        .optional()
});

// Middleware to validate user registration
const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);

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

// Middleware to validate user login
const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);

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

// Middleware to validate Google auth
const validateGoogleAuth = (req, res, next) => {
    const { error } = googleAuthSchema.validate(req.body);

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

// Middleware to validate profile update
const validateProfileUpdate = (req, res, next) => {
    const { error } = updateProfileSchema.validate(req.body);

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

module.exports = {
    validateRegister,
    validateLogin,
    validateGoogleAuth,
    validateProfileUpdate
};
