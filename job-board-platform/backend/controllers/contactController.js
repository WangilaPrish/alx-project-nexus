const Contact = require('../models/Contact');

// Submit contact form
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Create new contact instance
        const contactData = {
            name,
            email,
            subject,
            message,
            ip_address: req.clientIP,
            user_agent: req.userAgent
        };
        
        const contact = new Contact(contactData);
        const savedContact = await contact.save();
        
        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We\'ll get back to you soon.',
            data: {
                id: savedContact.id,
                name: savedContact.name,
                email: savedContact.email,
                subject: savedContact.subject,
                created_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error submitting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get all contacts (Admin endpoint)
const getAllContacts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || null;
        
        const result = await Contact.findAll(page, limit, status);
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get contact by ID (Admin endpoint)
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update contact status (Admin endpoint)
const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['unread', 'read', 'replied'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: unread, read, replied'
            });
        }
        
        const updated = await Contact.updateStatus(id, status);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Contact status updated successfully'
        });
    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete contact (Admin endpoint)
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Contact.delete(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get contact statistics (Admin endpoint)
const getContactStats = async (req, res) => {
    try {
        const stats = await Contact.getStats();
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching contact stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    submitContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
    getContactStats
};
