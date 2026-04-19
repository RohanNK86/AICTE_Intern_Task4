const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            validate: {
                validator: validator.isEmail,
                message: 'Please provide a valid email address',
            },
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            minlength: [10, 'Message must be at least 10 characters'],
            maxlength: [2000, 'Message cannot exceed 2000 characters'],
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
