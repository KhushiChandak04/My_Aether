import express from 'express';
import axios from 'axios';
import NodeCache from 'node-cache';
const router = express.Router();
const cache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
// Proxy endpoint for CoinGecko market data
router.get('/crypto', async (_req, res) => {
    try {
        const cacheKey = 'crypto_markets';
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }
        const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 50,
                page: 1,
                sparkline: true,
                price_change_percentage: '24h'
            }
        });
        cache.set(cacheKey, response.data);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching crypto data:', error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to fetch crypto data',
            details: error.message
        });
    }
});
// Proxy endpoint for historical data
router.get('/crypto/:id/history', async (req, res) => {
    try {
        const { id } = req.params;
        const { days = 7 } = req.query;
        const cacheKey = `crypto_history_${id}_${days}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }
        const response = await axios.get(`${COINGECKO_API}/coins/${id}/market_chart`, {
            params: {
                vs_currency: 'usd',
                days: days
            }
        });
        cache.set(cacheKey, response.data);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching historical data:', error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to fetch historical data',
            details: error.message
        });
    }
});
export default router;
