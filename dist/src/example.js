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
const index_1 = require("./index");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function main() {
    console.log('Starting AetherAI trading system...');
    if (!process.env.APTOS_NODE_URL) {
        console.error('Error: Missing APTOS_NODE_URL environment variable.');
        return;
    }
    try {
        // Initialize AetherAI
        const ai = new index_1.AetherAI(process.env.APTOS_NODE_URL);
        // Initialize AI trading wallet
        console.log('\nInitializing AI trading wallet...');
        const walletAddress = await ai.initializeWallet();
        console.log('AI trading wallet ready:', walletAddress);
        // Register a new AI trading strategy
        console.log('\nRegistering new AI strategy...');
        const strategyParams = {
            model_type: 'lstm',
            lookback_period: 14,
            threshold: 2.0,
            risk_factor: 0.5,
            last_updated: Date.now()
        };
        console.log('Strategy parameters:', strategyParams);
        const strategyTxn = await ai.registerStrategy('LSTM_Mean_Reversion', JSON.stringify(strategyParams));
        // Wait for strategy registration to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Execute a trade based on AI signals
        console.log('\nExecuting trade based on AI signals...');
        const tradeParams = {
            action: 'BUY',
            amount: 1000000, // Amount in smallest units (e.g., 1 APT = 100000000 units)
            price: 150000000 // Price in smallest units
        };
        console.log('Trade parameters:', tradeParams);
        const tradeTxn = await ai.executeTrade(Date.now(), // Use current timestamp as strategy ID
        tradeParams.action, tradeParams.amount, tradeParams.price);
        // Display final status
        console.log('\nAI Trading Session Summary:');
        console.log('Strategy Registration:', `https://explorer.aptoslabs.com/txn/${strategyTxn.hash}?network=devnet`);
        console.log('Trade Execution:', `https://explorer.aptoslabs.com/txn/${tradeTxn.hash}?network=devnet`);
    }
    catch (error) {
        console.error('\nError occurred:');
        if (error instanceof Error) {
            console.error('Message:', error.message);
        }
        else {
            console.error('Unknown error:', error);
        }
        process.exit(1);
    }
}
main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
