import { AetherAI } from './index';
import { Types } from 'aptos';
import { EventEmitter } from 'events';

interface TradingSignal {
    action: 'BUY' | 'SELL';
    amount: number;
    price: number;
    confidence: number;
    timestamp: number;
}

export class AITradingBot extends EventEmitter {
    private ai: AetherAI;
    private _isRunning: boolean = false;
    private strategyId: number;
    private minConfidence: number;
    private checkInterval: number;
    private lastCheck: number = 0;

    constructor(
        nodeUrl: string,
        strategyId: number,
        options = {
            minConfidence: 0.7,  // Lower confidence threshold
            checkInterval: 5000, // Check every 5 seconds
        }
    ) {
        super();
        this.ai = new AetherAI(nodeUrl);
        this.strategyId = strategyId;
        this.minConfidence = options.minConfidence;
        this.checkInterval = options.checkInterval;
    }

    /**
     * Check if the bot is running
     */
    public isRunning(): boolean {
        return this._isRunning;
    }

    /**
     * Initialize the trading bot
     */
    async initialize(): Promise<void> {
        console.log('Initializing AI Trading Bot...');
        
        // Initialize AI wallet
        const walletAddress = await this.ai.initializeWallet('trading_bot');
        console.log('Trading bot wallet initialized:', walletAddress);

        // Set up event listeners
        this.setupEventListeners();
    }

    /**
     * Start automated trading
     */
    async start(): Promise<void> {
        if (this._isRunning) {
            console.log('Trading bot is already running');
            return;
        }

        console.log('Starting automated trading...');
        this._isRunning = true;
        this.runTradingLoop();
    }

    /**
     * Stop automated trading
     */
    stop(): void {
        console.log('Stopping automated trading...');
        this._isRunning = false;
    }

    private setupEventListeners(): void {
        // Handle successful trades
        this.on('tradingSignal', async (signal: TradingSignal) => {
            console.log(`\nReceived trading signal:`, signal);
            
            try {
                // Validate signal
                if (!signal.action || !['BUY', 'SELL'].includes(signal.action)) {
                    throw new Error(`Invalid trade action: ${signal.action}`);
                }

                if (!signal.amount || signal.amount <= 0) {
                    throw new Error(`Invalid trade amount: ${signal.amount}`);
                }

                if (!signal.price || signal.price <= 0) {
                    throw new Error(`Invalid trade price: ${signal.price}`);
                }

                if (signal.confidence < this.minConfidence) {
                    console.log(`Signal confidence ${signal.confidence} below threshold ${this.minConfidence}, skipping trade`);
                    return;
                }

                // Get current wallet balance
                const balance = await this.ai.getWalletBalance();
                const totalCost = BigInt(Math.floor(signal.amount * signal.price * 100_000_000));
                
                if (signal.action === 'BUY' && balance < totalCost) {
                    throw new Error(`Insufficient balance for trade. Required: ${totalCost.toString()} Octas, Available: ${balance.toString()} Octas`);
                }

                console.log('\nExecuting trade with parameters:');
                console.log('Action:', signal.action);
                console.log('Amount:', signal.amount, 'APT');
                console.log('Price:', signal.price, 'APT');
                console.log('Total Cost:', totalCost.toString(), 'Octas');
                
                const transaction = await this.ai.executeTrade(
                    this.strategyId,
                    signal.action,
                    signal.amount,
                    signal.price
                );
                
                this.emit('tradeExecuted', {
                    signal,
                    transaction,
                    timestamp: Date.now()
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error('\nTrade execution failed:', errorMessage);
                
                this.emit('tradeError', { 
                    signal, 
                    error: {
                        message: errorMessage,
                        timestamp: Date.now()
                    }
                });
            }
        });

        // Log successful trades
        this.on('tradeExecuted', (data: { signal: TradingSignal, transaction: Types.UserTransaction }) => {
            console.log('\nTrade executed successfully!');
            console.log('Action:', data.signal.action);
            console.log('Amount:', data.signal.amount, 'APT');
            console.log('Price:', data.signal.price, 'APT');
            console.log('Transaction:', `https://explorer.aptoslabs.com/txn/${data.transaction.hash}?network=devnet`);
        });

        // Handle errors
        this.on('tradeError', (data: { signal: TradingSignal, error: any }) => {
            console.error('\nError executing trade:', data.error.message);
            console.error('Signal:', JSON.stringify(data.signal, null, 2));
            console.error('Timestamp:', new Date(data.error.timestamp).toISOString());
        });
    }

    private async runTradingLoop(): Promise<void> {
        while (this._isRunning) {
            const now = Date.now();
            
            // Only check for signals if enough time has passed
            if (now - this.lastCheck >= this.checkInterval) {
                try {
                    const signal = await this.generateTradingSignal();
                    if (signal) {
                        this.emit('tradingSignal', signal);
                    }
                } catch (error) {
                    console.error('Error generating trading signal:', error);
                }
                this.lastCheck = now;
            }

            // Small delay to prevent CPU overload
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    /**
     * Generate trading signals based on AI analysis
     * This is where you would implement your AI model's prediction logic
     */
    private async generateTradingSignal(): Promise<TradingSignal | null> {
        // Increased probability of generating signals
        const shouldTrade = Math.random() > 0.3; // 70% chance of generating a signal
        
        if (!shouldTrade) {
            return null;
        }

        const confidence = 0.7 + (Math.random() * 0.3); // Generate confidence between 0.7 and 1.0
        
        // Generate more realistic trade amounts (0.1 to 1.0 APT)
        const amount = 0.1 + (Math.random() * 0.9);
        
        // Generate realistic price (around current APT price with some variation)
        const basePrice = 10.0; // Base APT price in USD
        const variation = basePrice * 0.05; // 5% price variation
        const price = basePrice - variation + (Math.random() * variation * 2);

        return {
            action: Math.random() > 0.5 ? 'BUY' : 'SELL',
            amount: parseFloat(amount.toFixed(4)),
            price: parseFloat(price.toFixed(4)),
            confidence: confidence,
            timestamp: Date.now()
        };
    }
}
