const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.provider = data.provider || 'email'; // 'email' or 'google'
        this.provider_id = data.provider_id;
        this.avatar = data.avatar;
        this.is_verified = data.is_verified || false;
        this.is_active = data.is_active || true;
    }

    // Create a new user
    async save() {
        try {
            console.log('🔧 Attempting to save user:', {
                name: this.name,
                email: this.email,
                provider: this.provider,
                provider_id: this.provider_id,
                avatar: this.avatar,
                is_verified: this.is_verified,
                is_active: this.is_active
            });

            // Hash password if it's email registration
            let hashedPassword = null;
            if (this.password && this.provider === 'email') {
                hashedPassword = await bcrypt.hash(this.password, 12);
                console.log('🔒 Password hashed successfully');
            }

            const query = `
                INSERT INTO users (name, email, password, provider, provider_id, avatar, is_verified, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                this.name,
                this.email,
                hashedPassword,
                this.provider,
                this.provider_id || null,
                this.avatar || null,
                this.is_verified,
                this.is_active
            ];

            console.log('📝 Executing query with values:', values);
            const [result] = await pool.execute(query, values);
            console.log('✅ User created successfully with ID:', result.insertId);

            return {
                id: result.insertId,
                name: this.name,
                email: this.email,
                provider: this.provider,
                avatar: this.avatar,
                is_verified: this.is_verified,
                is_active: this.is_active
            };
        } catch (error) {
            console.error('❌ Error saving user:', error);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error message:', error.message);
            console.error('❌ SQL state:', error.sqlState);
            console.error('❌ SQL message:', error.sqlMessage);

            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Email already exists');
            }
            throw new Error('Failed to create user');
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const query = `
                SELECT id, name, email, password, provider, provider_id, avatar, is_verified, is_active, created_at, updated_at
                FROM users
                WHERE email = ? AND is_active = true
            `;

            const [rows] = await pool.execute(query, [email]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error('Failed to find user');
        }
    }

    // Find user by ID
    static async findById(id) {
        try {
            const query = `
                SELECT id, name, email, provider, provider_id, avatar, is_verified, is_active, created_at, updated_at
                FROM users
                WHERE id = ? AND is_active = true
            `;

            const [rows] = await pool.execute(query, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw new Error('Failed to find user');
        }
    }

    // Find user by provider ID (for Google auth)
    static async findByProviderId(providerId, provider = 'google') {
        try {
            const query = `
                SELECT id, name, email, provider, provider_id, avatar, is_verified, is_active, created_at, updated_at
                FROM users
                WHERE provider_id = ? AND provider = ? AND is_active = true
            `;

            const [rows] = await pool.execute(query, [providerId, provider]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding user by provider ID:', error);
            throw new Error('Failed to find user');
        }
    }

    // Verify password
    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error('Error verifying password:', error);
            return false;
        }
    }

    // Generate JWT token
    static generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    // Update user profile
    static async updateProfile(id, updateData) {
        try {
            const allowedFields = ['name', 'avatar'];
            const fields = [];
            const values = [];

            for (const [key, value] of Object.entries(updateData)) {
                if (allowedFields.includes(key) && value !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(value);
                }
            }

            if (fields.length === 0) {
                throw new Error('No valid fields to update');
            }

            values.push(id);
            const query = `
                UPDATE users
                SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            const [result] = await pool.execute(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error('Failed to update profile');
        }
    }

    // Update email verification status
    static async updateVerificationStatus(id, isVerified = true) {
        try {
            const query = `
                UPDATE users
                SET is_verified = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            const [result] = await pool.execute(query, [isVerified, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating verification status:', error);
            throw new Error('Failed to update verification status');
        }
    }

    // Get user statistics
    static async getStats() {
        try {
            const query = `
                SELECT
                    COUNT(*) as total,
                    SUM(CASE WHEN provider = 'email' THEN 1 ELSE 0 END) as email_users,
                    SUM(CASE WHEN provider = 'google' THEN 1 ELSE 0 END) as google_users,
                    SUM(CASE WHEN is_verified = true THEN 1 ELSE 0 END) as verified_users,
                    SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as this_week,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as this_month
                FROM users
                WHERE is_active = true
            `;

            const [rows] = await pool.execute(query);
            return rows[0];
        } catch (error) {
            console.error('Error fetching user stats:', error);
            throw new Error('Failed to fetch user statistics');
        }
    }
}

module.exports = User;
