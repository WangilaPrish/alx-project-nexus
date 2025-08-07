const { pool } = require('../config/database');

class Contact {
    constructor(data) {
        this.name = data.name;
        this.email = data.email;
        this.subject = data.subject;
        this.message = data.message;
        this.status = data.status || 'unread';
        this.ip_address = data.ip_address;
        this.user_agent = data.user_agent;
    }

    // Create a new contact submission
    async save() {
        try {
            const query = `
                INSERT INTO contacts (name, email, subject, message, status, ip_address, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            const values = [
                this.name,
                this.email,
                this.subject,
                this.message,
                this.status,
                this.ip_address,
                this.user_agent
            ];

            const [result] = await pool.execute(query, values);
            return {
                id: result.insertId,
                ...this
            };
        } catch (error) {
            console.error('Error saving contact:', error);
            throw new Error('Failed to save contact submission');
        }
    }

    // Get all contacts with pagination
    static async findAll(page = 1, limit = 10, status = null) {
        try {
            const offset = (page - 1) * limit;
            let query = `
                SELECT id, name, email, subject, message, status, created_at, updated_at
                FROM contacts
            `;
            let countQuery = 'SELECT COUNT(*) as total FROM contacts';
            const values = [];

            if (status) {
                query += ' WHERE status = ?';
                countQuery += ' WHERE status = ?';
                values.push(status);
            }

            query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
            values.push(limit, offset);

            const [contacts] = await pool.execute(query, values);
            const [countResult] = await pool.execute(countQuery, status ? [status] : []);
            
            return {
                contacts,
                total: countResult[0].total,
                page,
                limit,
                totalPages: Math.ceil(countResult[0].total / limit)
            };
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw new Error('Failed to fetch contacts');
        }
    }

    // Find contact by ID
    static async findById(id) {
        try {
            const query = `
                SELECT id, name, email, subject, message, status, ip_address, user_agent, created_at, updated_at
                FROM contacts
                WHERE id = ?
            `;
            
            const [rows] = await pool.execute(query, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('Error finding contact by ID:', error);
            throw new Error('Failed to find contact');
        }
    }

    // Update contact status
    static async updateStatus(id, status) {
        try {
            const query = `
                UPDATE contacts
                SET status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            const [result] = await pool.execute(query, [status, id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating contact status:', error);
            throw new Error('Failed to update contact status');
        }
    }

    // Delete contact
    static async delete(id) {
        try {
            const query = 'DELETE FROM contacts WHERE id = ?';
            const [result] = await pool.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error deleting contact:', error);
            throw new Error('Failed to delete contact');
        }
    }

    // Get contact statistics
    static async getStats() {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'unread' THEN 1 ELSE 0 END) as unread,
                    SUM(CASE WHEN status = 'read' THEN 1 ELSE 0 END) as read,
                    SUM(CASE WHEN status = 'replied' THEN 1 ELSE 0 END) as replied,
                    SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as this_week,
                    SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as this_month
                FROM contacts
            `;
            
            const [rows] = await pool.execute(query);
            return rows[0];
        } catch (error) {
            console.error('Error fetching contact stats:', error);
            throw new Error('Failed to fetch contact statistics');
        }
    }
}

module.exports = Contact;
