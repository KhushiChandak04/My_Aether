import Web3 from "web3";
import { AptosService } from "./aptosService";
import { api } from "./api";
import type { provider } from "web3-core";

export interface TradeHistory {
  _id?: string;
  walletAddress: string;
  strategy: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
  profit?: number;
  txHash?: string;
}

export interface TradingStrategy {
  id: string;
  name: string;
  description: string;
  risk: "Low" | "Medium" | "High";
  expectedReturn: string;
  timeframe: string;
  minInvestment: number;
  maxInvestment: number;
  defaultStopLoss: number;
  defaultTakeProfit: number;
}

export interface TradingStats {
  totalProfit: number;
  totalTrades: number;
  winRate: number;
  activeTime: number;
  lastPrice: number;
  currentPosition: "long" | "short" | null;
  lastTradeTime: Date | null;
}

export interface TradingBotConfig {
  strategy: string;
  investmentAmount: number;
  stopLoss?: number;
  takeProfit?: number;
  walletAddress: string;
}

class TradingBotService {
  private web3Instance: Web3;
  private activeConfigs: Map<string, TradingBotConfig> = new Map();
  private tradingStats: Map<string, TradingStats> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private aptosService: AptosService;

  constructor() {
    if (typeof window !== "undefined" && window.ethereum) {
      // Cast window.ethereum to provider type for Web3
      const provider = window.ethereum as unknown as provider;
      this.web3Instance = new Web3(provider);
    } else {
      this.web3Instance = new Web3("http://localhost:8545");
    }
    this.aptosService = new AptosService();
  }

  public async startTrading(config: TradingBotConfig) {
    try {
      // Register strategy on blockchain
      const strategy = this.getStrategy(config.strategy);
      if (!strategy) throw new Error("Invalid strategy");

      const params = JSON.stringify({
        risk_level: strategy.risk.toLowerCase(),
        investment_amount: config.investmentAmount,
        stop_loss: config.stopLoss,
        take_profit: config.takeProfit,
      });

      // Register strategy with Aptos
      await this.aptosService.registerStrategy(
        config.walletAddress,
        strategy.name,
        params
      );

      // Initialize trading state
      this.activeConfigs.set(config.walletAddress, config);
      this.tradingStats.set(config.walletAddress, this.getInitialStats());

      // Start trading interval
      const interval = setInterval(
        () => this.executeTrading(config.walletAddress),
        60000
      );
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

    } catch (error) {
      console.error("Failed to start trading:", error);
      throw error;
    }
  }

  private async executeTrading(walletAddress: string) {
    const config = this.activeConfigs.get(walletAddress);
    if (!config) return;

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
          status: "pending" as const,
          txHash: `0x${Date.now().toString(16)}${Math.random().toString(16).substring(2)}`
        };

        await this.recordTrade(trade);

        try {
          // Execute trade on Aptos blockchain
          await this.aptosService.executeTrade(
            walletAddress,
            config.strategy,
            config.investmentAmount,
            currentPrice,
            action
          );

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

        } catch (error) {
          console.error("Failed to execute trade on blockchain:", error);
          // Update trade status to failed
          await this.recordTrade({
            ...trade,
            status: "failed"
          });
        }
      }
    } catch (error) {
      console.error("Failed to execute trade:", error);
    }
  }

  private async getCurrentPrice(): Promise<number> {
    try {
      const response = await fetch('/api/market/crypto');
      const data = await response.json();
      
      // CoinGecko returns an array of coins, we want ETH (usually index 1 or 2)
      const ethData = data.find((coin: any) => 
        coin.symbol.toLowerCase() === 'eth' || 
        coin.id.toLowerCase() === 'ethereum'
      );

      if (!ethData) {
        throw new Error('ETH price data not available');
      }

      return ethData.current_price;
    } catch (error) {
      console.error('Error getting current price:', error);
      // Return a simulated price if API fails
      const basePrice = 1800; // Base ETH price
      const variance = 50; // Price variance
      return basePrice + (Math.random() * variance * 2 - variance);
    }
  }

  private determineTradeAction(currentPrice: number): 'buy' | 'sell' | null {
    const lastStats = Array.from(this.tradingStats.values())[0];
    if (!lastStats) return null;

    const priceChange = lastStats.lastPrice ? (currentPrice - lastStats.lastPrice) / lastStats.lastPrice : 0;
    
    // Simple trading logic based on price movement
    if (priceChange > 0.02) { // Price increased by 2%
      return 'sell';
    } else if (priceChange < -0.02) { // Price decreased by 2%
      return 'buy';
    }
    
    return null;
  }

  public readonly strategies: TradingStrategy[] = [
    {
      id: "grid",
      name: "Grid Trading",
      description:
        "Places buy and sell orders at regular intervals above and below the market price",
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
      description:
        "Follows market trends and trades in the direction of price movement",
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
      description:
        "Trades on the assumption that prices will return to their average",
      risk: "Medium",
      expectedReturn: "8-20% monthly",
      timeframe: "Medium-term",
      minInvestment: 300,
      maxInvestment: 30000,
      defaultStopLoss: 6,
      defaultTakeProfit: 12,
    },
  ];

  private getInitialStats(): TradingStats {
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

  private async recordTrade(trade: Omit<TradeHistory, "_id">): Promise<void> {
    try {
      await api.recordTrade(trade);
    } catch (error) {
      console.error("Failed to record trade:", error);
    }
  }

  private async simulateTrading(
    walletAddress: string,
    config: TradingBotConfig
  ) {
    const stats =
      this.tradingStats.get(walletAddress) || this.getInitialStats();
    const strategy = this.strategies.find((s) => s.id === config.strategy);

    if (!strategy) return;

    let ethBalance = 0;

    // Check if this is an Aptos address (starts with 0x and is 66 characters long)
    const isAptosAddress =
      walletAddress.startsWith("0x") && walletAddress.length === 66;

    if (isAptosAddress) {
      console.log("Detected Aptos address, using simulated balance");
      ethBalance = 1 + Math.random() * 9;
    } else {
      try {
        const balance = await this.web3Instance.eth.getBalance(walletAddress);
        ethBalance = parseFloat(
          this.web3Instance.utils.fromWei(balance, "ether")
        );
      } catch (error) {
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
    let tradeType: "buy" | "sell" = "buy";
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
        } else if (priceChange < 0 && stats.currentPosition !== "short") {
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
          status: "pending" as const,
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

      } catch (error) {
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

  public async startBot(config: TradingBotConfig): Promise<void> {
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

  public async stopBot(walletAddress: string): Promise<void> {
    const interval = this.intervals.get(walletAddress);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(walletAddress);
      this.activeConfigs.delete(walletAddress);
    }
  }

  public getStats(walletAddress: string): TradingStats | null {
    return this.tradingStats.get(walletAddress) || null;
  }

  public isRunning(walletAddress: string): boolean {
    return this.intervals.has(walletAddress);
  }

  public getConfig(walletAddress: string): TradingBotConfig | null {
    return this.activeConfigs.get(walletAddress) || null;
  }

  public getStrategy(strategyId: string): TradingStrategy | undefined {
    return this.strategies.find((s) => s.id === strategyId);
  }

}

export const tradingBotService = new TradingBotService();
