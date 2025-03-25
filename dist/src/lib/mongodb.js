import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
// Load environment variables
dotenv.config();
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'aether';
if (!uri) {
    console.error('\x1b[31m%s\x1b[0m', 'Error: MONGODB_URI not found in environment variables');
    console.log('\n\x1b[33m%s\x1b[0m', 'Please follow these steps to set up MongoDB:');
    console.log('1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas');
    console.log('2. Create a new cluster (free tier is fine)');
    console.log('3. Click "Connect" and follow the setup instructions');
    console.log('4. Create a .env file in your project root with:');
    console.log('   MONGODB_URI=your_connection_string\n');
    process.exit(1);
}
// Global variable for caching the MongoDB connection
let mongoClient = null;
let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds
// Create a new MongoClient with optimized options
const options = {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
    minPoolSize: 5,
    maxPoolSize: 50,
    tls: true,
};
export async function connectToDatabase() {
    try {
        // If we already have a connection, return it
        if (mongoClient && await mongoClient.db(dbName).command({ ping: 1 })) {
            return { client: mongoClient, db: mongoClient.db(dbName) };
        }
        // Close any existing connection that might be in a bad state
        if (mongoClient) {
            await mongoClient.close();
            mongoClient = null;
        }
        // Connect to MongoDB Atlas
        mongoClient = new MongoClient(uri, options);
        await mongoClient.connect();
        console.log('\x1b[32m%s\x1b[0m', 'Successfully connected to MongoDB Atlas');
        // Reset retry count on successful connection
        retryCount = 0;
        // Handle connection errors and cleanup
        mongoClient.on('error', async (error) => {
            console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection error:', error);
            if (mongoClient) {
                await mongoClient.close();
                mongoClient = null;
            }
        });
        mongoClient.on('close', () => {
            console.log('\x1b[33m%s\x1b[0m', 'MongoDB connection closed');
            mongoClient = null;
        });
        mongoClient.on('timeout', async () => {
            console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection timeout');
            if (mongoClient) {
                await mongoClient.close();
                mongoClient = null;
            }
        });
        return { client: mongoClient, db: mongoClient.db(dbName) };
    }
    catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error connecting to MongoDB:', error);
        // Implement retry logic
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log('\x1b[33m%s\x1b[0m', `Retrying connection (Attempt ${retryCount}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return connectToDatabase();
        }
        // Reset retry count and rethrow error if max retries reached
        retryCount = 0;
        throw error;
    }
}
