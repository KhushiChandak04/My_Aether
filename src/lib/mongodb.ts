import { MongoClient, MongoClientOptions } from 'mongodb';
import { config } from 'dotenv';
import { resolve } from 'path';
import dns from 'dns';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongodb URI to .env.local');
}

// Use IPv4 DNS resolution
dns.setDefaultResultOrder('ipv4first');

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Force IPv4
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    try {
      console.log('Attempting to connect to MongoDB...');
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect().then(client => {
        console.log('Successfully connected to MongoDB');
        return client;
      });
    } catch (error) {
      console.error('Error creating MongoDB client:', error);
      throw error;
    }
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  try {
    console.log('Attempting to connect to MongoDB...');
    client = new MongoClient(uri, options);
    clientPromise = client.connect().then(client => {
      console.log('Successfully connected to MongoDB');
      return client;
    });
  } catch (error) {
    console.error('Error creating MongoDB client:', error);
    throw error;
  }
}

export async function connectToDatabase() {
  if (!clientPromise) {
    throw new Error('MongoDB client not initialized');
  }
  
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}
