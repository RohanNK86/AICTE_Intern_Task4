const Contact = require('../model/contactModel');

// ─────────────────────────────────────────────
// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
// ─────────────────────────────────────────────
const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic presence check (Mongoose validators will handle the rest)
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and message.',
            });
        }

        const newContact = await Contact.create({ name, email, message });

        return res.status(201).json({
            success: true,
            message: 'Message received! I will get back to you soon 🙌',
            data: newContact,
        });
    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: errors.join(', '),
            });
        }

        console.error('❌ Contact form submission error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

// ─────────────────────────────────────────────
// @desc    Get all contact messages (admin use)
// @route   GET /api/contact
// @access  Public (restrict with auth middleware later if needed)
// ─────────────────────────────────────────────
const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error) {
        console.error('❌ Error fetching contacts:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

module.exports = { submitContactForm, getAllContacts };
