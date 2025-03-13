"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const trading_bot_1 = require("./trading-bot");
const index_1 = require("./index");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function testTradingSystem() {
    if (!process.env.APTOS_NODE_URL) {
        console.error('Error: Missing APTOS_NODE_URL environment variable');
        process.exit(1);
    }
    console.log('🚀 Starting AI Trading System Test\n');
    try {
        // 1. Initialize AetherAI and create wallet
        console.log('Step 1: Initializing AetherAI...');
        const ai = new index_1.AetherAI(process.env.APTOS_NODE_URL);
        const walletAddress = await ai.initializeWallet('test_wallet');
        console.log('✅ Wallet initialized:', walletAddress);
        // 2. Register a test trading strategy
        console.log('\nStep 2: Registering test strategy...');
        const strategyParams = {
            model_type: 'test_model',
            lookback_period: 10,
            threshold: 1.5,
            risk_factor: 0.3
        };
        const strategyTxn = await ai.registerStrategy('Test_Strategy', JSON.stringify(strategyParams));
        console.log('✅ Strategy registered:', `https://explorer.aptoslabs.com/txn/${strategyTxn.hash}?network=devnet`);
        // 3. Initialize trading bot with test settings
        console.log('\nStep 3: Initializing trading bot...');
        const bot = new trading_bot_1.AITradingBot(process.env.APTOS_NODE_URL, Date.now(), {
            minConfidence: 0.6, // Lower threshold for testing
            checkInterval: 10000 // Check every 10 seconds for testing
        });
        // Initialize bot
        await bot.initialize();
        console.log('✅ Trading bot initialized');
        // 4. Set up test monitoring
        console.log('\nStep 4: Setting up monitoring...');
        let tradeCount = 0;
        const maxTrades = 3; // Test 3 trades then stop
        bot.on('tradingSignal', (signal) => {
            console.log('\n📊 Trading Signal Received:');
            console.log('Action:', signal.action);
            console.log('Amount:', signal.amount);
            console.log('Price:', signal.price);
            console.log('Confidence:', signal.confidence);
        });
        bot.on('tradeExecuted', (data) => {
            console.log('\n✅ Trade Executed:');
            console.log('Transaction:', `https://explorer.aptoslabs.com/txn/${data.transaction.hash}?network=devnet`);
            tradeCount++;
            if (tradeCount >= maxTrades) {
                console.log('\n🎉 Test completed successfully!');
                console.log(`Executed ${tradeCount} test trades`);
                bot.stop();
                process.exit(0);
            }
        });
        bot.on('tradeError', (data) => {
            console.error('\n❌ Trade Error:', data.error);
            console.error('Failed Signal:', data.signal);
        });
        // 5. Start the trading bot
        console.log('\nStep 5: Starting automated trading test...');
        console.log('Will execute', maxTrades, 'test trades then stop');
        console.log('Monitoring for trading signals...\n');
        await bot.start();
    }
    catch (error) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    }
}
// Run the test
testTradingSystem().catch(console.error);
