import axios from "axios";
import express from "express";
import { connectToDatabase } from "../../lib/mongodb";

const router = express.Router();

// Cache market data to avoid rate limits
let cachedData: any = null;
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

    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
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
      }
    );

    // Update cache and store in MongoDB
    cachedData = response.data;
    lastFetchTime = now;

    // Store the latest market data in MongoDB
    try {
      const { db } = await connectToDatabase();
      await db.collection("market_data").deleteMany({}); // Clear old data
      await db.collection("market_data").insertMany(response.data);
    } catch (dbError) {
      console.error("Failed to update market data in MongoDB:", dbError);
    }

    // Set CORS headers explicitly
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.json(cachedData);
  } catch (error) {
    console.error("Error fetching crypto data:", error);

    // Try to fetch from MongoDB as backup
    try {
      const { db } = await connectToDatabase();
      const marketData = await db.collection("market_data").find().toArray();
      
      if (marketData && marketData.length > 0) {
        return res.json(marketData);
      }
    } catch (dbError) {
      console.error("Failed to fetch market data from MongoDB:", dbError);
    }

    // If everything fails, return error
    res.status(500).json({ 
      error: "Failed to fetch market data",
      message: "Service temporarily unavailable"
    });
  }
});

export default router;
