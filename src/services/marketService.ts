import axios from 'axios';

export interface CryptoData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    total_volume: number;
    sparkline_in_7d: {
        price: number[];
    };
}

export interface HistoricalData {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

class MarketService {
    private readonly API_BASE_URL = 'http://localhost:4000/api';

    async getTopCryptos(): Promise<CryptoData[]> {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/market/crypto`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching crypto data:', error);
            return [];
        }
    }

    async getCryptoDetails(id: string): Promise<any> {
        return this.retryWithDelay(async () => {
            const response = await axios.get(`${this.API_BASE_URL}/market/crypto/${id}`);
            return response.data;
        });
    }

    async getHistoricalData(id: string, days: number = 7): Promise<HistoricalData | null> {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/market/crypto/${id}/history`, {
                params: { days }
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching historical data:', error);
            return null;
        }
    }

    async getMarketStats(): Promise<any> {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/market/stats`);
            return response.data;
        } catch (error: any) {
            console.error('Error fetching market stats:', error);
            return null;
        }
    }

    // Add retry logic and rate limit handling
    private async retryWithDelay<T>(
        operation: () => Promise<T>,
        retries: number = 3,
        delay: number = 1000
    ): Promise<T> {
        try {
            return await operation();
        } catch (error: any) {
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
