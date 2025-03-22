"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketService = void 0;
const axios_1 = __importDefault(require("axios"));
class MarketService {
    constructor() {
        this.API_BASE_URL = 'https://api.coingecko.com/api/v3';
    }
    async getTopCryptos(limit = 100) {
        try {
            const response = await axios_1.default.get(`${this.API_BASE_URL}/coins/markets`, {
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
        }
        catch (error) {
            console.error('Error fetching crypto data:', error);
            return [];
        }
    }
    async getCryptoDetails(id) {
        try {
            const response = await axios_1.default.get(`${this.API_BASE_URL}/coins/${id}`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching crypto details:', error);
            return null;
        }
    }
    async getHistoricalData(id, days = 7) {
        try {
            const response = await axios_1.default.get(`${this.API_BASE_URL}/coins/${id}/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days: days,
                    interval: days <= 1 ? 'minute' : 'daily'
                }
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
            const response = await axios_1.default.get(`${this.API_BASE_URL}/global`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching market stats:', error);
            return null;
        }
    }
}
exports.marketService = new MarketService();
