"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = require("ws");
const index_1 = require("./index");
const trading_bot_1 = require("./trading-bot");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)();
const port = 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize our trading system
const ai = new index_1.AetherAI(process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com/v1');
let tradingBot = null;
let wsServer;
let connectedClients = [];
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});
// Broadcast updates to all connected clients
const broadcast = (data) => {
    const message = JSON.stringify(data);
    connectedClients.forEach(client => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(message);
        }
    });
};
// Create a new wallet
app.post('/api/create-wallet', async (_req, res) => {
    try {
        console.log('Creating new wallet...');
        // Create new wallet
        const walletAddress = await ai.initializeWallet('trading_bot');
        console.log('Wallet created:', walletAddress);
        // Fund the wallet on devnet
        console.log('Funding wallet...');
        await ai.fundWalletForTesting();
        console.log('Wallet funded');
        // Get final balance
        const balance = await ai.getWalletBalance();
        console.log('Wallet balance:', balance.toString());
        res.json({
            success: true,
            walletAddress,
            balance: balance.toString(),
            message: 'Created and funded new wallet'
        });
    }
    catch (error) {
        console.error('Wallet creation error:', error);
        res.status(500).json({
            success: false,
            error: String(error)
        });
    }
});
// Initialize the trading system
app.post('/api/initialize', async (_req, res) => {
    try {
        if (!ai.hasWallet()) {
            throw new Error('Please connect wallet first');
        }
        const walletAddress = await ai.getWalletAddress();
        const balance = await ai.getWalletBalance();
        // Create trading bot instance with our smart contract module
        tradingBot = new trading_bot_1.AITradingBot(process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com/v1', Date.now(), {
            minConfidence: 0.7,
            checkInterval: 30000, // 30 seconds
        });
        // Set up bot event handlers
        tradingBot.on('tradingSignal', (signal) => {
            broadcast({ type: 'signal', signal });
        });
        tradingBot.on('tradeExecuted', (data) => {
            broadcast({ type: 'trade', trade: data });
            // Update balance after trade
            ai.getWalletBalance().then(newBalance => {
                broadcast({ type: 'balance', balance: newBalance.toString() });
            });
        });
        tradingBot.on('tradeError', (data) => {
            broadcast({ type: 'error', error: data.error });
        });
        await tradingBot.initialize();
        console.log('Trading bot initialized');
        res.json({
            success: true,
            walletAddress,
            balance: balance.toString(),
            message: 'AI trading system initialized successfully'
        });
    }
    catch (error) {
        console.error('Initialization error:', error);
        res.status(500).json({
            success: false,
            error: String(error),
            message: 'Failed to initialize AI trading system'
        });
    }
});
// Start the trading bot
app.post('/api/start', async (_req, res) => {
    try {
        if (!tradingBot) {
            throw new Error('Trading bot not initialized');
        }
        await tradingBot.start();
        res.json({ success: true });
    }
    catch (error) {
        console.error('Start error:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
});
// Stop the trading bot
app.post('/api/stop', (_req, res) => {
    try {
        if (!tradingBot) {
            throw new Error('Trading bot not initialized');
        }
        tradingBot.stop();
        res.json({ success: true });
    }
    catch (error) {
        console.error('Stop error:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
});
// Register a new trading strategy
app.post('/api/register-strategy', async (req, res) => {
    try {
        const { name, parameters } = req.body;
        const transaction = await ai.registerStrategy(name, JSON.stringify(parameters));
        res.json({ success: true, transaction });
    }
    catch (error) {
        console.error('Register strategy error:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
});
// Start the server
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    // Initialize WebSocket server
    wsServer = new ws_1.WebSocketServer({ server });
    wsServer.on('connection', (ws) => {
        connectedClients.push(ws);
        console.log('New client connected');
        ws.on('close', () => {
            connectedClients = connectedClients.filter(client => client !== ws);
            console.log('Client disconnected');
        });
    });
});
