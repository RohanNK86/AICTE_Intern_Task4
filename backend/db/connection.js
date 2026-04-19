const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Replace <password> placeholder in DB_URL with actual DB_PASSWORD
        const uri = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);

        await mongoose.connect(uri);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;
