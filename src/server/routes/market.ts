import axios from "axios";
import express from "express";

const router = express.Router();

// Proxy endpoint for CoinGecko market data
router.get("/crypto", async (req, res) => {
  try {
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
      }
    );

    // Set CORS headers explicitly
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching crypto data:", error);

    // Check for rate limiting or specific API errors
    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.error ||
      (error instanceof Error ? error.message : "Unknown error occurred");

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
});

export default router;
