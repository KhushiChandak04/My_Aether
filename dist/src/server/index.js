"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wss = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = __importDefault(require("ws"));
const defi_1 = __importDefault(require("./routes/defi"));
const liquidity_1 = __importDefault(require("./routes/liquidity"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/defi', defi_1.default);
app.use('/api/liquidity', liquidity_1.default);
// Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// WebSocket server for real-time updates
const wss = new ws_1.default.Server({ server });
exports.wss = wss;
wss.on('connection', (ws) => {
    console.log('Client connected');
    // Send initial data
    ws.send(JSON.stringify({
        type: 'status',
        message: 'Connected to AetherAI trading system'
    }));
    // Send liquidity optimization updates
    const sendLiquidityUpdate = (data) => {
        ws.send(JSON.stringify({
            type: 'liquidity_update',
            data
        }));
    };
    // Example: Send periodic APY updates
    const updateInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            sendLiquidityUpdate({
                timestamp: Date.now(),
                poolUpdates: [
                    {
                        protocol: 'Liquidswap',
                        pair: 'APT/USDC',
                        apy: (Math.random() * 50).toFixed(2)
                    }
                ]
            });
        }
    }, 30000);
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(updateInterval);
    });
});
exports.default = app;
