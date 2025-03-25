import axios from 'axios';
class MarketService {
    constructor() {
        this.API_BASE_URL = 'http://localhost:4000/api';
    }
    async getTopCryptos() {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/market/crypto`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching crypto data:', error);
            return [];
        }
    }
    async getCryptoDetails(id) {
        return this.retryWithDelay(async () => {
            const response = await axios.get(`${this.API_BASE_URL}/market/crypto/${id}`);
            return response.data;
        });
    }
    async getHistoricalData(id, days = 7) {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/market/crypto/${id}/history`, {
                params: { days }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching historical data:', error);
            return null;
        }
    }
    async getMarketStats() {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/market/stats`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching market stats:', error);
            return null;
        }
    }
    // Add retry logic and rate limit handling
    async retryWithDelay(operation, retries = 3, delay = 1000) {
        try {
            return await operation();
        }
        catch (error) {
            if (retries === 0 || !axios.isAxiosError(error)) {
                throw error;
            }
            // Handle rate limiting specifically
            if (error.response?.status === 429) {
                const waitTime = parseInt(error.response.headers['retry-after']) * 1000 || delay;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return this.retryWithDelay(operation, retries - 1, delay * 2);
            }
            // Handle other errors with exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.retryWithDelay(operation, retries - 1, delay * 2);
        }
    }
}
export const marketService = new MarketService();
