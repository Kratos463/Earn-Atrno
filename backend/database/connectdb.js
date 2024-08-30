require('dotenv').config();
const mongoose = require('mongoose');


const connectDB = async () => {
    try {

        const dbURI = process.env.DATABASE_URL;
        const dbName = process.env.DB_NAME;

        // Check if the URI is defined
        if (!dbURI) {
            throw new Error('Database URL is not defined in .env file');
        }

        // Connect to MongoDB
        await mongoose.connect(`${dbURI}/${dbName}`);

        console.log('----------> MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
