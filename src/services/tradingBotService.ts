import Web3 from "web3";

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

  constructor() {
    if (typeof window !== "undefined" && window.ethereum) {
      this.web3Instance = new Web3(window.ethereum);
    } else {
      this.web3Instance = new Web3("http://localhost:8545"); // Fallback to local node
    }
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
      // For Aptos addresses, use a simulated balance instead of trying to query with Web3
      console.log("Detected Aptos address, using simulated balance");
      // Use a random value between 1-10 ETH equivalent for simulation
      ethBalance = 1 + Math.random() * 9;
    } else {
      try {
        // Get current ETH balance for Ethereum addresses
        const balance = await this.web3Instance.eth.getBalance(walletAddress);
        ethBalance = parseFloat(
          this.web3Instance.utils.fromWei(balance, "ether")
        );
      } catch (error) {
        console.error("Error getting wallet balance:", error);
        // Fallback to a default value
        ethBalance = 1;
      }
    }

    // Simulate price movement
    const priceChange = (Math.random() * 2 - 1) * 0.002; // Random price change ±0.2%
    const newPrice = stats.lastPrice
      ? stats.lastPrice * (1 + priceChange)
      : ethBalance;

    // Trading logic based on strategy
    switch (strategy.id) {
      case "grid":
        // Place orders at fixed intervals
        if (!stats.currentPosition) {
          stats.currentPosition = priceChange > 0 ? "long" : "short";
          stats.lastTradeTime = new Date();
          stats.totalTrades++;
        }
        break;

      case "momentum":
        // Follow the trend
        if (priceChange > 0 && stats.currentPosition !== "long") {
          stats.currentPosition = "long";
          stats.lastTradeTime = new Date();
          stats.totalTrades++;
        } else if (priceChange < 0 && stats.currentPosition !== "short") {
          stats.currentPosition = "short";
          stats.lastTradeTime = new Date();
          stats.totalTrades++;
        }
        break;

      case "arbitrage":
        // Simulate finding arbitrage opportunities
        if (Math.random() > 0.8) {
          // 20% chance of finding opportunity
          stats.currentPosition = Math.random() > 0.5 ? "long" : "short";
          stats.lastTradeTime = new Date();
          stats.totalTrades++;
        }
        break;

      case "mean-reversion":
        // Trade against extreme moves
        if (Math.abs(priceChange) > 0.001) {
          stats.currentPosition = priceChange > 0 ? "short" : "long";
          stats.lastTradeTime = new Date();
          stats.totalTrades++;
        }
        break;
    }

    // Update stats
    const profitChange =
      stats.currentPosition === "long" ? priceChange : -priceChange;
    stats.totalProfit += profitChange * config.investmentAmount;
    stats.lastPrice = newPrice;
    stats.activeTime++;

    if (stats.totalTrades > 0) {
      const successRate = Math.random(); // Simulate win rate based on strategy
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

  private async executeTradeOnChain(
    walletAddress: string,
    config: TradingBotConfig,
    action: string,
    amount: number,
    price: number
  ) {
    try {
      // Prepare transaction payload for Move contract
      const payload = {
        function: "execute_trade",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [
          config.strategy,
          new TextEncoder().encode(action),
          Math.floor(amount * 100_000_000), // Convert to Octas
          Math.floor(price * 100_000_000), // Convert to Octas
        ],
      };

      // Submit transaction
      const transaction = await this.web3Instance.eth.sendTransaction({
        from: walletAddress,
        to: config.walletAddress,
        data: JSON.stringify(payload),
      });

      console.log("Trade executed on-chain:", transaction.transactionHash);
      return transaction;
    } catch (error) {
      console.error("Error executing trade on-chain:", error);
      throw error;
    }
  }
}

export const tradingBotService = new TradingBotService();
