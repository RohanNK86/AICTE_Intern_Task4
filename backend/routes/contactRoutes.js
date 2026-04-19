const express = require('express');
const router = express.Router();
const { submitContactForm, getAllContacts } = require('../controller/contactController');

// POST /api/contact  → Store a new message from the portfolio contact form
router.post('/', submitContactForm);

// GET  /api/contact  → Retrieve all submitted messages (admin / testing)
router.get('/', getAllContacts);

module.exports = router;
