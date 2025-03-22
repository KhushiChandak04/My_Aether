"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("../../lib/mongodb");
const router = express_1.default.Router();
// Cache market data to avoid rate limits
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds
// Proxy endpoint for CoinGecko market data
router.get("/crypto", async (_req, res) => {
    try {
        // Check cache first
        const now = Date.now();
        if (cachedData && now - lastFetchTime < CACHE_DURATION) {
            return res.json(cachedData);
        }
        // Add API key if available (for higher rate limits)
        const apiKey = process.env.COINGECKO_API_KEY;
        const headers = apiKey ? { "x-cg-pro-api-key": apiKey } : {};
        const response = await axios_1.default.get("https://api.coingecko.com/api/v3/coins/markets", {
            headers,
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 20,
                page: 1,
                sparkline: true,
                price_change_percentage: "24h",
            },
            timeout: 5000, // 5 second timeout
        });
        // Update cache and store in MongoDB
        cachedData = response.data;
        lastFetchTime = now;
        // Store the latest market data in MongoDB
        try {
            const { db } = await (0, mongodb_1.connectToDatabase)();
            await db.collection("market_data").deleteMany({}); // Clear old data
            await db.collection("market_data").insertMany(response.data);
        }
        catch (dbError) {
            console.error("Failed to update market data in MongoDB:", dbError);
        }
        // Set CORS headers explicitly
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.json(cachedData);
    }
    catch (error) {
        console.error("Error fetching crypto data:", error);
        // Try to fetch from MongoDB as backup
        try {
            const { db } = await (0, mongodb_1.connectToDatabase)();
            const marketData = await db.collection("market_data").find().toArray();
            if (marketData && marketData.length > 0) {
                return res.json(marketData);
            }
        }
        catch (dbError) {
            console.error("Failed to fetch market data from MongoDB:", dbError);
        }
        // If everything fails, return error
        res.status(500).json({
            error: "Failed to fetch market data",
            message: "Service temporarily unavailable"
        });
    }
});
exports.default = router;
