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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function main() {
    if (!process.env.APTOS_NODE_URL) {
        console.error('Error: Missing APTOS_NODE_URL environment variable');
        process.exit(1);
    }
    try {
        // Create AI trading bot with custom settings
        const bot = new trading_bot_1.AITradingBot(process.env.APTOS_NODE_URL, Date.now(), // Strategy ID
        {
            minConfidence: 0.8, // Only execute trades with 80% or higher confidence
            checkInterval: 30000, // Check for trading signals every 30 seconds
        });
        // Initialize bot and wallet
        await bot.initialize();
        // Handle Ctrl+C gracefully
        process.on('SIGINT', () => {
            console.log('\nReceived shutdown signal...');
            bot.stop();
            console.log('Trading bot stopped. Exiting...');
            process.exit(0);
        });
        // Start automated trading
        await bot.start();
        // Keep the process running
        process.stdin.resume();
        console.log('\nAI Trading Bot is now running autonomously!');
        console.log('Press Ctrl+C to stop the bot.');
    }
    catch (error) {
        console.error('Error running trading bot:', error);
        process.exit(1);
    }
}
main().catch(console.error);
