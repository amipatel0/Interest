const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interest_app');
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed: ', err);
        process.exit(1);
    }
};

module.exports = connectDB;
