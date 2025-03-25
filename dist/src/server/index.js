import cors from "cors";
import express from "express";
import WebSocket from "ws";
import defiRoutes from "./routes/defi";
import liquidityRoutes from "./routes/liquidity";
import marketRoutes from "./routes/market";
const app = express();
const port = process.env.PORT || 3001;
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/defi", defiRoutes);
app.use("/api/liquidity", liquidityRoutes);
app.use("/api/market", marketRoutes);
// Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// WebSocket server for real-time updates
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
    console.log("Client connected");
    // Send initial data
    ws.send(JSON.stringify({
        type: "status",
        message: "Connected to AetherAI trading system",
    }));
    // Send liquidity optimization updates
    const sendLiquidityUpdate = (data) => {
        ws.send(JSON.stringify({
            type: "liquidity_update",
            data,
        }));
    };
    // Example: Send periodic APY updates
    const updateInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            sendLiquidityUpdate({
                timestamp: Date.now(),
                poolUpdates: [
                    {
                        protocol: "Liquidswap",
                        pair: "APT/USDC",
                        apy: (Math.random() * 50).toFixed(2),
                    },
                ],
            });
        }
    }, 30000);
    ws.on("close", () => {
        console.log("Client disconnected");
        clearInterval(updateInterval);
    });
});
export { wss }; // Export for external use
export default app;
