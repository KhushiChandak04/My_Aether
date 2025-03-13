import express from 'express';
import cors from 'cors';
import { WebSocket, WebSocketServer } from 'ws';
import { AetherAI } from './index';
import { AITradingBot } from './trading-bot';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize our trading system
const ai = new AetherAI(process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com/v1');
let tradingBot: AITradingBot | null = null;
let wsServer: WebSocketServer;
let connectedClients: WebSocket[] = [];

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Broadcast updates to all connected clients
const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    connectedClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
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
  } catch (error) {
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
        tradingBot = new AITradingBot(
            process.env.APTOS_NODE_URL || 'https://fullnode.devnet.aptoslabs.com/v1',
            Date.now(),
            {
                minConfidence: 0.7,
                checkInterval: 30000, // 30 seconds
                moduleAddress: '0x23306993ed0d0feb8ef9d97cd6853cf54b21ac058a5c2fddda801020cb7c5789'
            }
        );

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
        console.error('Register strategy error:', error);
        res.status(500).json({ success: false, error: String(error) });
    }
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);

    // Initialize WebSocket server
    wsServer = new WebSocketServer({ server });

    wsServer.on('connection', (ws: WebSocket) => {
        connectedClients.push(ws);
        console.log('New client connected');

        ws.on('close', () => {
            connectedClients = connectedClients.filter(client => client !== ws);
            console.log('Client disconnected');
        });
    });
});
