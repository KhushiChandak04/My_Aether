import express from 'express';
import { connectToDatabase } from '../../lib/mongodb';

const router = express.Router();

// Interface matching our frontend TradeHistory type
interface Trade {
  walletAddress: string;
  strategy: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  profit?: number;
  txHash?: string;
}

// Get all trades
router.get('/', async (_req, res) => {
  try {
    const { db } = await connectToDatabase();
    const trades = await db
      .collection('trades')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    
    res.status(200).json({ success: true, data: trades });
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trades' });
  }
});

// Get trade history
router.get('/history', async (req, res) => {
  try {
    const { db } = await connectToDatabase();
    const trades = await db
      .collection('trades')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    
    res.status(200).json({ success: true, data: trades });
  } catch (error) {
    console.error('Error fetching trade history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trade history' });
  }
});

// Record a new trade
router.post('/', express.json(), async (req, res) => {
  try {
    const trade = req.body as Trade;
    
    // Validate required fields
    if (!trade.walletAddress || !trade.strategy || !trade.type || !trade.amount || !trade.price) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: walletAddress, strategy, type, amount, price' 
      });
    }

    // Ensure timestamp is a Date object
    trade.timestamp = trade.timestamp ? new Date(trade.timestamp) : new Date();
    
    const { db } = await connectToDatabase();
    await db.collection('trades').insertOne(trade);
    
    res.status(200).json({ success: true, data: trade });
  } catch (error) {
    console.error('Error recording trade:', error);
    res.status(500).json({ success: false, error: 'Failed to record trade' });
  }
});

export default router;
