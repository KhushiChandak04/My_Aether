import { config } from 'dotenv';
import { resolve } from 'path';
import { connectToDatabase } from '../src/lib/mongodb';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    const { db } = await connectToDatabase();
    console.log('Successfully connected to MongoDB!');

    // Create trades collection if it doesn't exist
    await db.createCollection('trades');
    console.log('Trades collection created/verified');

    // Sample trade data
    const sampleTrades = [
      {
        id: '1',
        type: 'buy',
        token: 'ETH',
        amount: 0.5,
        price: 3000,
        timestamp: Date.now() - 3600000, // 1 hour ago
        status: 'completed',
        txHash: '0x123abc...'
      },
      {
        id: '2',
        type: 'sell',
        token: 'ETH',
        amount: 0.5,
        price: 3100,
        timestamp: Date.now() - 1800000, // 30 minutes ago
        profit: 50,
        status: 'completed',
        txHash: '0x456def...'
      },
      {
        id: '3',
        type: 'buy',
        token: 'BTC',
        amount: 0.1,
        price: 45000,
        timestamp: Date.now() - 900000, // 15 minutes ago
        status: 'pending',
        txHash: '0x789ghi...'
      }
    ];

    // Insert sample trades
    const result = await db.collection('trades').insertMany(sampleTrades);
    console.log(`Inserted ${result.insertedCount} sample trades`);

    // Verify trades were inserted
    const trades = await db.collection('trades').find({}).toArray();
    console.log('\nCurrent trades in database:');
    console.log(JSON.stringify(trades, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

testConnection();
