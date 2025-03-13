import cors from "cors";
import express from "express";
import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { AetherAI } from "./index";
import liquidityRoutes from "./server/routes/liquidity";
import marketRoutes from "./server/routes/market";
import { AITradingBot } from "./trading-bot";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize trading bot
const nodeUrl =
  process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com/v1";
const ai = new AetherAI(nodeUrl);
let tradingBot: AITradingBot | null = null;
let strategyId: number = Date.now();

// Create HTTP server
const server = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();

// Broadcast to all connected clients
const broadcast = (data: any) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Handle WebSocket connections
wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");
  clients.add(ws);

  // Send current status
  ws.send(
    JSON.stringify({
      type: "status",
      status: {
        initialized: tradingBot !== null,
        running: tradingBot?.isRunning() || false,
      },
    })
  );

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Mount routes
app.use("/api/liquidity", liquidityRoutes);
app.use("/api/market", marketRoutes);

// API Routes
app.use("/api/status", (_req, res) => {
  res.json({
    initialized: tradingBot !== null,
    running: tradingBot?.isRunning() || false,
  });
});

app.post("/api/create-wallet", async (_req, res) => {
  try {
    const address = await ai.initializeWallet("trading_bot");
    await ai.fundWalletForTesting();
    res.json({ address });
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ error: "Failed to create wallet" });
  }
});

app.post("/api/initialize", async (_req, res) => {
  try {
    if (!tradingBot) {
      tradingBot = new AITradingBot(nodeUrl, strategyId);

      // Set up event listeners
      tradingBot.on("tradingSignal", (signal) => {
        broadcast({ type: "signal", signal });
      });

      tradingBot.on("tradeExecuted", (data) => {
        broadcast({
          type: "trade",
          trade: {
            action: data.signal.action,
            amount: data.signal.amount.toString(),
            timestamp: data.timestamp,
            txHash: data.transaction.hash,
          },
        });
      });

      tradingBot.on("tradeError", (data) => {
        broadcast({
          type: "error",
          error: data.error.message,
        });
      });

      await tradingBot.initialize();
      broadcast({
        type: "status",
        status: {
          initialized: true,
          running: false,
        },
      });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Error initializing bot:", error);
    res.status(500).json({ error: "Failed to initialize bot" });
  }
});

app.post("/api/start", async (_req, res) => {
  try {
    if (!tradingBot) {
      throw new Error("Trading bot not initialized");
    }
    await tradingBot.start();
    broadcast({
      type: "status",
      status: {
        initialized: true,
        running: true,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error starting bot:", error);
    res.status(500).json({ error: "Failed to start bot" });
  }
});

app.post("/api/stop", async (_req, res) => {
  try {
    if (!tradingBot) {
      throw new Error("Trading bot not initialized");
    }
    tradingBot.stop();
    broadcast({
      type: "status",
      status: {
        initialized: true,
        running: false,
      },
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error stopping bot:", error);
    res.status(500).json({ error: "Failed to stop bot" });
  }
});

app.post("/api/register-strategy", async (req, res) => {
  try {
    if (!tradingBot) {
      throw new Error("Trading bot not initialized");
    }

    const { name, parameters } = req.body;
    const transaction = await ai.registerStrategy(
      name,
      JSON.stringify(parameters)
    );

    res.json({
      success: true,
      transaction: {
        hash: transaction.hash,
        url: `https://explorer.aptoslabs.com/txn/${transaction.hash}?network=devnet`,
      },
    });
  } catch (error) {
    console.error("Error registering strategy:", error);
    res.status(500).json({ error: "Failed to register strategy" });
  }
});

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
