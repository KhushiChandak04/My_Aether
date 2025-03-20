import { MongoClient } from 'mongodb';

// Use the exact connection string format from MongoDB Atlas
const uri = 'mongodb+srv://pateldev098765:iJe7MCecy40aUHx7@aether-cluster.q2e9q.mongodb.net/?retryWrites=true&w=majority&appName=aether-cluster';
const dbName = 'aether';

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(uri);

    await client.connect();
    console.log('Successfully connected to MongoDB!');

    const db = client.db(dbName);

    // Create trades collection if it doesn't exist
    await db.createCollection('trades');
    console.log('Trades collection created/verified');

    // Sample trade data matching our TradeHistory schema
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

    // Delete existing trades for clean test
    await db.collection('trades').deleteMany({});
    console.log('Cleared existing trades');

    // Insert sample trades
    const result = await db.collection('trades').insertMany(sampleTrades);
    console.log(`Inserted ${result.insertedCount} sample trades`);

    // Verify trades were inserted in chronological order
    const trades = await db.collection('trades')
      .find({})
      .sort({ timestamp: 1 })
      .toArray();
    
    console.log('\nCurrent trades in database (chronological order):');
    console.log(JSON.stringify(trades, null, 2));

    await client.close();
    console.log('\nConnection closed successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

testConnection();
