const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const contactRoutes = require('./routes/contactRoutes');

// ── Connect to MongoDB ────────────────────────────────────────────────────────
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        const uri = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

connectDB();

// ── App Setup ─────────────────────────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/contact', contactRoutes);

// Health-check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Portfolio backend is running 🚀' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});