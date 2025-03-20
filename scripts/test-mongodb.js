require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    console.log('\x1b[32m%s\x1b[0m', '✓ Successfully connected to MongoDB!');
    
    const db = client.db('aether');
    const collections = await db.listCollections().toArray();
    
    console.log('\n\x1b[36m%s\x1b[0m', 'Available collections:');
    if (collections.length === 0) {
      console.log('\x1b[33m%s\x1b[0m', '- No collections found. Will create required collections.');
      
      // Create collections with validators
      await db.createCollection('trades', {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["type", "token", "amount", "price", "timestamp", "status", "txHash"],
            properties: {
              type: { enum: ["buy", "sell"] },
              token: { bsonType: "string" },
              amount: { bsonType: "number" },
              price: { bsonType: "number" },
              timestamp: { bsonType: "number" },
              status: { enum: ["pending", "completed"] },
              txHash: { bsonType: "string" },
              profit: { bsonType: "number" }
            }
          }
        }
      });
      
      await db.createCollection('market_data', {
        validator: {
          $jsonSchema: {
            bsonType: "object",
            required: ["id", "symbol", "name", "current_price"],
            properties: {
              id: { bsonType: "string" },
              symbol: { bsonType: "string" },
              name: { bsonType: "string" },
              current_price: { bsonType: "number" },
              market_cap: { bsonType: "number" },
              price_change_percentage_24h: { bsonType: "number" }
            }
          }
        }
      });
      
      console.log('\x1b[32m%s\x1b[0m', '✓ Created collections: trades, market_data');
    } else {
      collections.forEach(c => console.log(`- ${c.name}`));
    }
    
    // Create indexes
    await db.collection('trades').createIndex({ timestamp: -1 });
    await db.collection('trades').createIndex({ token: 1 });
    await db.collection('market_data').createIndex({ symbol: 1 });
    
    console.log('\n\x1b[32m%s\x1b[0m', '✓ Database setup complete!');
    await client.close();
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'Error connecting to MongoDB:');
    console.error(err);
    process.exit(1);
  }
}

testConnection();
