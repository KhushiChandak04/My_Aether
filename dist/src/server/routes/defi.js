"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallet_1 = require("../../wallet");
const types_1 = require("../../protocols/types");
const router = express_1.default.Router();
const NODE_URL = process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com';
// Initialize wallet
const wallet = new wallet_1.AIWallet(NODE_URL);
router.post('/execute', async (req, res) => {
    try {
        const { action, params } = req.body;
        // Validate request
        if (!action || !params) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }
        // Load wallet (in production, this would be handled by session management)
        await wallet.load('ai_trader');
        let result;
        switch (action) {
            case types_1.ProtocolAction.SWAP: {
                const route = await wallet.protocolManager.getOptimalSwapRoute(params.tokenIn, params.tokenOut, BigInt(params.amountIn));
                result = await wallet.protocolManager.executeProtocolAction(route.protocol, types_1.ProtocolAction.SWAP, route.params);
                break;
            }
            case types_1.ProtocolAction.SUPPLY:
            case types_1.ProtocolAction.BORROW:
            case types_1.ProtocolAction.REPAY: {
                const protocol = await wallet.protocolManager.getOptimalLendingProtocol(params.token, BigInt(params.amount));
                result = await wallet.protocolManager.executeProtocolAction(protocol.protocol, action, protocol.params);
                break;
            }
            default:
                return res.status(400).json({
                    success: false,
                    error: `Unsupported action: ${action}`
                });
        }
        res.json({
            success: true,
            transaction: result
        });
    }
    catch (error) {
        console.error('DeFi execution error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
router.get('/protocols', async (_req, res) => {
    try {
        // Get available protocols
        const dexes = wallet.protocolManager.getProtocolsByType(types_1.ProtocolType.DEX);
        const lendingProtocols = wallet.protocolManager.getProtocolsByType(types_1.ProtocolType.LENDING);
        res.json({
            success: true,
            protocols: {
                dex: dexes.map(p => ({ name: p.name, address: p.address })),
                lending: lendingProtocols.map(p => ({ name: p.name, address: p.address }))
            }
        });
    }
    catch (error) {
        console.error('Error fetching protocols:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
exports.default = router;
