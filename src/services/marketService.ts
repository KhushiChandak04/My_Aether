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
    private readonly API_BASE_URL = 'https://api.coingecko.com/api/v3';

    async getTopCryptos(limit: number = 100): Promise<CryptoData[]> {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: limit,
                    page: 1,
                    sparkline: true,
                    price_change_percentage: '24h'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            return [];
        }
    }

    async getCryptoDetails(id: string): Promise<any> {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/coins/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching crypto details:', error);
            return null;
        }
    }

    async getHistoricalData(id: string, days: number = 7): Promise<HistoricalData | null> {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/coins/${id}/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days: days,
                    interval: days <= 1 ? 'minute' : 'daily'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching historical data:', error);
            return null;
        }
    }

    async getMarketStats(): Promise<any> {
        try {
            const response = await axios.get(`${this.API_BASE_URL}/global`);
            return response.data;
        } catch (error) {
            console.error('Error fetching market stats:', error);
            return null;
        }
    }
}

export const marketService = new MarketService();
