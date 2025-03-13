import express from 'express';
import { AIWallet } from '../../wallet';
import { LiquidityOptimizer } from '../../services/liquidityOptimizer';

const router = express.Router();
const NODE_URL = process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com';

// Initialize wallet
const wallet = new AIWallet(NODE_URL);
const optimizer = new LiquidityOptimizer(wallet.protocolManager);

router.post('/optimize', async (req, res) => {
    try {
        const { availableTokens, riskTolerance } = req.body;

        if (!availableTokens) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }

        // Load wallet (in production, this would be handled by session management)
        await wallet.load('ai_trader');

        const strategy = await optimizer.optimizeLiquidity(availableTokens, riskTolerance);

        res.json({
            success: true,
            strategy
        });
    } catch (error) {
        console.error('Liquidity optimization error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

router.post('/execute', async (req, res) => {
    try {
        const { strategy } = req.body;

        if (!strategy) {
            return res.status(400).json({
                success: false,
                error: 'Missing strategy parameters'
            });
        }

        // Load wallet (in production, this would be handled by session management)
        await wallet.load('ai_trader');

        const transactions = await optimizer.executeLiquidityStrategy(strategy);

        res.json({
            success: true,
            transactions
        });
    } catch (error) {
        console.error('Strategy execution error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

export default router;
