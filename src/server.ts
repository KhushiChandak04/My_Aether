import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './lib/mongodb';
import marketRoutes from './server/routes/market';
import tradeRoutes from './server/routes/trades';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and create collections if needed
async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase();

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    const requiredCollections = [
      { name: 'market_data', schema: {
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
      }},
      { name: 'trades', schema: {
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
      }}
    ];

    for (const { name, schema } of requiredCollections) {
      if (!collectionNames.includes(name)) {
        await db.createCollection(name, { validator: { $jsonSchema: schema } });
        console.log(`✓ Created ${name} collection`);
      }
    }

    await db.collection('trades').createIndex({ timestamp: -1 });
    await db.collection('trades').createIndex({ token: 1 });
    await db.collection('market_data').createIndex({ symbol: 1 });

    console.log('✓ Database initialization complete');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

// Health check endpoint
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/market', marketRoutes);
app.use('/api/trades', tradeRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    const server = app.listen(port, () => {
      console.log(`✓ Server running on port ${port}`);
      console.log(`  Health check: http://localhost:${port}/health`);
      console.log(`  Market API: http://localhost:${port}/api/market/crypto`);
      console.log(`  Trades API: http://localhost:${port}/api/trades`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try a different port.`);
        process.exit(1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

startServer();

export default app;
