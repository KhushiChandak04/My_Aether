import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    const { db } = await connectToDatabase();

    // Fetch all trades
    const trades = await db
      .collection('trades')
      .find({})
      .sort({ timestamp: -1 }) // Sort by most recent first
      .toArray();

    return res.status(200).json(trades);
  } catch (error) {
    console.error('Error fetching trade history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

