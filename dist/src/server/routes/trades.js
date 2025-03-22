"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("../../lib/mongodb");
const router = express_1.default.Router();
// Get all trades
router.get('/', async (_req, res) => {
    try {
        const { db } = await (0, mongodb_1.connectToDatabase)();
        const trades = await db
            .collection('trades')
            .find({})
            .sort({ timestamp: -1 })
            .toArray();
        res.status(200).json({ success: true, data: trades });
    }
    catch (error) {
        console.error('Error fetching trades:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch trades' });
    }
});
// Record a new trade
router.post('/', express_1.default.json(), async (req, res) => {
    try {
        const trade = req.body;
        // Validate required fields
        if (!trade.walletAddress || !trade.strategy || !trade.type || !trade.amount || !trade.price) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: walletAddress, strategy, type, amount, price'
            });
        }
        // Ensure timestamp is a Date object
        trade.timestamp = trade.timestamp ? new Date(trade.timestamp) : new Date();
        const { db } = await (0, mongodb_1.connectToDatabase)();
        await db.collection('trades').insertOne(trade);
        res.status(200).json({ success: true, data: trade });
    }
    catch (error) {
        console.error('Error recording trade:', error);
        res.status(500).json({ success: false, error: 'Failed to record trade' });
    }
});
exports.default = router;
