const User = require('../models/User');

// Register user with email and password
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const userData = {
            name,
            email,
            password,
            provider: 'email',
            is_verified: false // Email users need verification
        };

        const user = new User(userData);
        const savedUser = await user.save();

        // Generate JWT token
        const token = User.generateToken(savedUser);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            data: {
                user: {
                    id: savedUser.id,
                    name: savedUser.name,
                    email: savedUser.email,
                    provider: savedUser.provider,
                    avatar: savedUser.avatar,
                    is_verified: savedUser.is_verified
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Login user with email and password
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user registered with email (has password)
        if (user.provider !== 'email' || !user.password) {
            return res.status(401).json({
                success: false,
                message: 'Please use Google sign-in for this account'
            });
        }

        // Verify password
        const isValidPassword = await User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = User.generateToken(user);

        res.json({
            success: true,
            message: 'Login successful!',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    provider: user.provider,
                    avatar: user.avatar,
                    is_verified: user.is_verified
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Google authentication
const googleAuth = async (req, res) => {
    try {
        const { name, email, provider_id, avatar } = req.body;

        // Check if user exists with Google provider ID
        let user = await User.findByProviderId(provider_id, 'google');

        if (!user) {
            // Check if user exists with same email but different provider
            const existingUser = await User.findByEmail(email);
            if (existingUser && existingUser.provider !== 'google') {
                return res.status(409).json({
                    success: false,
                    message: 'An account with this email already exists. Please sign in with email and password.'
                });
            }

            // Create new Google user
            const userData = {
                name,
                email,
                provider: 'google',
                provider_id,
                avatar,
                is_verified: true // Google users are automatically verified
            };

            const newUser = new User(userData);
            user = await newUser.save();
        }

        // Generate JWT token
        const token = User.generateToken(user);

        res.json({
            success: true,
            message: 'Google authentication successful!',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    provider: user.provider,
                    avatar: user.avatar,
                    is_verified: user.is_verified
                },
                token
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Google authentication failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const user = req.user; // From auth middleware

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    provider: user.provider,
                    avatar: user.avatar,
                    is_verified: user.is_verified,
                    created_at: user.created_at
                }
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        const updated = await User.updateProfile(userId, updateData);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get updated user data
        const updatedUser = await User.findById(userId);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    provider: updatedUser.provider,
                    avatar: updatedUser.avatar,
                    is_verified: updatedUser.is_verified
                }
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Logout (client-side token removal, but we can track it server-side in future)
const logout = async (req, res) => {
    try {
        // In a more advanced implementation, you might want to blacklist the token
        // For now, we just send a success response
        res.json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get user statistics (Admin endpoint)
const getUserStats = async (req, res) => {
    try {
        const stats = await User.getStats();

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    register,
    login,
    googleAuth,
    getProfile,
    updateProfile,
    logout,
    getUserStats
};
