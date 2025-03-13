import { AetherAI } from './index';
import { Types } from 'aptos';
import * as dotenv from 'dotenv';
import EventEmitter from 'events';

interface TradingSignal {
    action: 'BUY' | 'SELL';
    amount: number;
    price: number;
    confidence: number;
    timestamp: number;
}

export class AITradingBot extends EventEmitter {
    private ai: AetherAI;
    private isRunning: boolean = false;
    private strategyId: number;
    private minConfidence: number;
    private checkInterval: number;
    private lastCheck: number = 0;

    constructor(
        nodeUrl: string,
        strategyId: number,
        options = {
            minConfidence: 0.75,  // Minimum confidence threshold for executing trades
            checkInterval: 60000, // Check for signals every minute
        }
    ) {
        super();
        this.ai = new AetherAI(nodeUrl);
        this.strategyId = strategyId;
        this.minConfidence = options.minConfidence;
        this.checkInterval = options.checkInterval;
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
        if (this.isRunning) {
            console.log('Trading bot is already running');
            return;
        }

        console.log('Starting automated trading...');
        this.isRunning = true;
        this.runTradingLoop();
    }

    /**
     * Stop automated trading
     */
    stop(): void {
        console.log('Stopping automated trading...');
        this.isRunning = false;
    }

    private setupEventListeners(): void {
        // Handle successful trades
        this.on('tradingSignal', async (signal: TradingSignal) => {
            console.log(`\nReceived trading signal:`, signal);
            
            if (signal.confidence >= this.minConfidence) {
                try {
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
                    this.emit('tradeError', { signal, error });
                }
            } else {
                console.log(`Signal confidence ${signal.confidence} below threshold ${this.minConfidence}, skipping trade`);
            }
        });

        // Log successful trades
        this.on('tradeExecuted', (data: { signal: TradingSignal, transaction: Types.UserTransaction }) => {
            console.log('\nTrade executed successfully!');
            console.log('Action:', data.signal.action);
            console.log('Amount:', data.signal.amount);
            console.log('Price:', data.signal.price);
            console.log('Transaction:', `https://explorer.aptoslabs.com/txn/${data.transaction.hash}?network=devnet`);
        });

        // Handle errors
        this.on('tradeError', (data: { signal: TradingSignal, error: any }) => {
            console.error('\nError executing trade:', data.error);
            console.error('Signal:', data.signal);
        });
    }

    private async runTradingLoop(): Promise<void> {
        while (this.isRunning) {
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
        // TODO: Implement your AI model's prediction logic here
        // This is a placeholder that generates random signals for demonstration
        const shouldTrade = Math.random() > 0.7; // 30% chance of generating a signal
        
        if (!shouldTrade) {
            return null;
        }

        return {
            action: Math.random() > 0.5 ? 'BUY' : 'SELL',
            amount: Math.floor(Math.random() * 1000000) + 500000, // Random amount between 0.5 and 1.5 APT
            price: Math.floor(Math.random() * 100000000) + 100000000, // Random price between 1 and 2 APT
            confidence: Math.random(),
            timestamp: Date.now()
        };
    }
}
