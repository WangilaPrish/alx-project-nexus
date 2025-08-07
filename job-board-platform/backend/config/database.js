const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Initialize database tables
const initializeTables = async () => {
    try {
        const connection = await pool.getConnection();

        // Create users table
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NULL,
                provider ENUM('email', 'google') DEFAULT 'email',
                provider_id VARCHAR(255) NULL,
                avatar TEXT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_provider (provider),
                INDEX idx_provider_id (provider_id),
                INDEX idx_is_active (is_active)
            )
        `;

        await connection.execute(createUsersTable);
        console.log('✅ Users table initialized successfully');

        // Create contacts table
        const createContactsTable = `
            CREATE TABLE IF NOT EXISTS contacts (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                subject VARCHAR(500) NOT NULL,
                message TEXT NOT NULL,
                status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at)
            )
        `;

        await connection.execute(createContactsTable);
        console.log('✅ Contacts table initialized successfully');

        connection.release();
    } catch (error) {
        console.error('❌ Failed to initialize tables:', error.message);
        throw error;
    }
};

module.exports = {
    pool,
    testConnection,
    initializeTables
};
