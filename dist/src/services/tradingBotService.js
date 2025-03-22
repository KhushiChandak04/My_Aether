"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tradingBotService = void 0;
const web3_1 = __importDefault(require("web3"));
const aptosService_1 = require("./aptosService");
const api_1 = require("./api");
class TradingBotService {
    constructor() {
        this.activeConfigs = new Map();
        this.tradingStats = new Map();
        this.intervals = new Map();
        this.strategies = [
            {
                id: "grid",
                name: "Grid Trading",
                description: "Places buy and sell orders at regular intervals above and below the market price",
                risk: "Low",
                expectedReturn: "5-15% monthly",
                timeframe: "Short-term",
                minInvestment: 100,
                maxInvestment: 10000,
                defaultStopLoss: 5,
                defaultTakeProfit: 10,
            },
            {
                id: "momentum",
                name: "Momentum Trading",
                description: "Follows market trends and trades in the direction of price movement",
                risk: "Medium",
                expectedReturn: "10-25% monthly",
                timeframe: "Medium-term",
                minInvestment: 500,
                maxInvestment: 50000,
                defaultStopLoss: 8,
                defaultTakeProfit: 15,
            },
            {
                id: "arbitrage",
                name: "Arbitrage Trading",
                description: "Exploits price differences between different exchanges",
                risk: "Low",
                expectedReturn: "3-8% monthly",
                timeframe: "Short-term",
                minInvestment: 1000,
                maxInvestment: 100000,
                defaultStopLoss: 2,
                defaultTakeProfit: 5,
            },
            {
                id: "mean-reversion",
                name: "Mean Reversion",
                description: "Trades on the assumption that prices will return to their average",
                risk: "Medium",
                expectedReturn: "8-20% monthly",
                timeframe: "Medium-term",
                minInvestment: 300,
                maxInvestment: 30000,
                defaultStopLoss: 6,
                defaultTakeProfit: 12,
            },
        ];
        if (typeof window !== "undefined" && window.ethereum) {
            // Cast window.ethereum to provider type for Web3
            const provider = window.ethereum;
            this.web3Instance = new web3_1.default(provider);
        }
        else {
            this.web3Instance = new web3_1.default("http://localhost:8545");
        }
        this.aptosService = new aptosService_1.AptosService();
    }
    async startTrading(config) {
        try {
            // Register strategy on blockchain
            const strategy = this.getStrategy(config.strategy);
            if (!strategy)
                throw new Error("Invalid strategy");
            const params = JSON.stringify({
                risk_level: strategy.risk.toLowerCase(),
                investment_amount: config.investmentAmount,
                stop_loss: config.stopLoss,
                take_profit: config.takeProfit,
            });
            // Register strategy with Aptos
            await this.aptosService.registerStrategy(config.walletAddress, strategy.name, params);
            // Initialize trading state
            this.activeConfigs.set(config.walletAddress, config);
            this.tradingStats.set(config.walletAddress, this.getInitialStats());
            // Start trading interval
            const interval = setInterval(() => this.executeTrading(config.walletAddress), 60000);
            this.intervals.set(config.walletAddress, interval);
            // Record initial strategy registration
            await this.recordTrade({
                walletAddress: config.walletAddress,
                strategy: config.strategy,
                type: "buy", // Initial position is considered a buy
                amount: config.investmentAmount,
                price: await this.getCurrentPrice(),
                timestamp: new Date(),
                status: "completed",
                txHash: `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2)}`
            });
        }
        catch (error) {
            console.error("Failed to start trading:", error);
            throw error;
        }
    }
    async executeTrading(walletAddress) {
        const config = this.activeConfigs.get(walletAddress);
        if (!config)
            return;
        try {
            const currentPrice = await this.getCurrentPrice();
            const action = this.determineTradeAction(currentPrice);
            if (action) {
                // Record trade in database first
                const trade = {
                    walletAddress,
                    strategy: config.strategy,
                    type: action,
                    amount: config.investmentAmount,
                    price: currentPrice,
                    timestamp: new Date(),
                    status: "pending",
                    txHash: `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2)}`
                };
                await this.recordTrade(trade);
                try {
                    // Execute trade on Aptos blockchain
                    await this.aptosService.executeTrade(walletAddress, config.strategy, config.investmentAmount, currentPrice, action);
                    // Update trade status to completed
                    await this.recordTrade({
                        ...trade,
                        status: "completed",
                        profit: action === 'sell' ? (currentPrice * config.investmentAmount * 0.02) : undefined
                    });
                    // Update trading stats
                    const stats = this.tradingStats.get(walletAddress) || this.getInitialStats();
                    stats.lastPrice = currentPrice;
                    stats.lastTradeTime = new Date();
                    stats.totalTrades++;
                    if (action === 'sell') {
                        stats.totalProfit += (currentPrice * config.investmentAmount * 0.02);
                    }
                    this.tradingStats.set(walletAddress, stats);
                }
                catch (error) {
                    console.error("Failed to execute trade on blockchain:", error);
                    // Update trade status to failed
                    await this.recordTrade({
                        ...trade,
                        status: "failed"
                    });
                }
            }
        }
        catch (error) {
            console.error("Failed to execute trade:", error);
        }
    }
    async getCurrentPrice() {
        try {
            const response = await fetch('/api/market/crypto');
            const data = await response.json();
            // CoinGecko returns an array of coins, we want ETH (usually index 1 or 2)
            const ethData = data.find((coin) => coin.symbol.toLowerCase() === 'eth' ||
                coin.id.toLowerCase() === 'ethereum');
            if (!ethData) {
                throw new Error('ETH price data not available');
            }
            return ethData.current_price;
        }
        catch (error) {
            console.error('Error getting current price:', error);
            // Return a simulated price if API fails
            const basePrice = 1800; // Base ETH price
            const variance = 50; // Price variance
            return basePrice + (Math.random() * variance * 2 - variance);
        }
    }
    determineTradeAction(currentPrice) {
        const lastStats = Array.from(this.tradingStats.values())[0];
        if (!lastStats)
            return null;
        const priceChange = lastStats.lastPrice ? (currentPrice - lastStats.lastPrice) / lastStats.lastPrice : 0;
        // Simple trading logic based on price movement
        if (priceChange > 0.02) { // Price increased by 2%
            return 'sell';
        }
        else if (priceChange < -0.02) { // Price decreased by 2%
            return 'buy';
        }
        return null;
    }
    getInitialStats() {
        return {
            totalProfit: 0,
            totalTrades: 0,
            winRate: 0,
            activeTime: 0,
            lastPrice: 0,
            currentPosition: null,
            lastTradeTime: null,
        };
    }
    async recordTrade(trade) {
        try {
            await api_1.api.recordTrade(trade);
        }
        catch (error) {
            console.error("Failed to record trade:", error);
        }
    }
    async simulateTrading(walletAddress, config) {
        const stats = this.tradingStats.get(walletAddress) || this.getInitialStats();
        const strategy = this.strategies.find((s) => s.id === config.strategy);
        if (!strategy)
            return;
        let ethBalance = 0;
        // Check if this is an Aptos address (starts with 0x and is 66 characters long)
        const isAptosAddress = walletAddress.startsWith("0x") && walletAddress.length === 66;
        if (isAptosAddress) {
            console.log("Detected Aptos address, using simulated balance");
            ethBalance = 1 + Math.random() * 9;
        }
        else {
            try {
                const balance = await this.web3Instance.eth.getBalance(walletAddress);
                ethBalance = parseFloat(this.web3Instance.utils.fromWei(balance, "ether"));
            }
            catch (error) {
                console.error("Error getting wallet balance:", error);
                ethBalance = 1;
            }
        }
        // Simulate price movement
        const priceChange = (Math.random() * 2 - 1) * 0.002;
        const newPrice = stats.lastPrice
            ? stats.lastPrice * (1 + priceChange)
            : ethBalance;
        let tradeMade = false;
        let tradeType = "buy";
        let tradeProfit = 0;
        // Trading logic based on strategy
        switch (strategy.id) {
            case "grid":
                if (!stats.currentPosition) {
                    tradeType = priceChange > 0 ? "buy" : "sell";
                    tradeMade = true;
                    stats.currentPosition = priceChange > 0 ? "long" : "short";
                }
                break;
            case "momentum":
                if (priceChange > 0 && stats.currentPosition !== "long") {
                    tradeType = "buy";
                    tradeMade = true;
                    stats.currentPosition = "long";
                }
                else if (priceChange < 0 && stats.currentPosition !== "short") {
                    tradeType = "sell";
                    tradeMade = true;
                    stats.currentPosition = "short";
                }
                break;
            case "arbitrage":
                if (Math.random() > 0.8) {
                    tradeType = Math.random() > 0.5 ? "buy" : "sell";
                    tradeMade = true;
                    stats.currentPosition = tradeType === "buy" ? "long" : "short";
                }
                break;
            case "mean-reversion":
                if (Math.abs(priceChange) > 0.001) {
                    tradeType = priceChange > 0 ? "sell" : "buy";
                    tradeMade = true;
                    stats.currentPosition = tradeType === "buy" ? "long" : "short";
                }
                break;
        }
        if (tradeMade) {
            stats.lastTradeTime = new Date();
            stats.totalTrades++;
            // Calculate trade profit for sells
            tradeProfit = tradeType === "sell" ? config.investmentAmount * Math.abs(priceChange) : 0;
            try {
                // Record the trade with pending status
                const trade = {
                    walletAddress,
                    strategy: strategy.id,
                    type: tradeType,
                    amount: config.investmentAmount,
                    price: newPrice,
                    timestamp: stats.lastTradeTime,
                    status: "pending",
                    txHash: `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2)}`
                };
                await this.recordTrade(trade);
                // Simulate blockchain delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Update trade as completed
                await this.recordTrade({
                    ...trade,
                    status: "completed",
                    profit: tradeProfit > 0 ? tradeProfit : undefined
                });
            }
            catch (error) {
                console.error("Failed to record simulated trade:", error);
            }
        }
        // Update stats
        stats.totalProfit += tradeProfit;
        stats.lastPrice = newPrice;
        stats.activeTime++;
        if (stats.totalTrades > 0) {
            const successRate = Math.random();
            stats.winRate =
                (stats.winRate * (stats.totalTrades - 1) +
                    (successRate > 0.5 ? 1 : 0)) /
                    stats.totalTrades;
        }
        this.tradingStats.set(walletAddress, stats);
    }
    async startBot(config) {
        const { walletAddress } = config;
        if (this.intervals.has(walletAddress)) {
            throw new Error("Trading bot is already running for this wallet");
        }
        // Initialize stats if not exists
        if (!this.tradingStats.has(walletAddress)) {
            this.tradingStats.set(walletAddress, this.getInitialStats());
        }
        // Store config
        this.activeConfigs.set(walletAddress, config);
        // Start trading simulation
        const interval = setInterval(() => {
            this.simulateTrading(walletAddress, config);
        }, 5000); // Update every 5 seconds
        this.intervals.set(walletAddress, interval);
    }
    async stopBot(walletAddress) {
        const interval = this.intervals.get(walletAddress);
        if (interval) {
            clearInterval(interval);
            this.intervals.delete(walletAddress);
            this.activeConfigs.delete(walletAddress);
        }
    }
    getStats(walletAddress) {
        return this.tradingStats.get(walletAddress) || null;
    }
    isRunning(walletAddress) {
        return this.intervals.has(walletAddress);
    }
    getConfig(walletAddress) {
        return this.activeConfigs.get(walletAddress) || null;
    }
    getStrategy(strategyId) {
        return this.strategies.find((s) => s.id === strategyId);
    }
}
exports.tradingBotService = new TradingBotService();
