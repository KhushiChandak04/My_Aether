import { AITradingBot } from './trading-bot';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    if (!process.env.APTOS_NODE_URL) {
        console.error('Error: Missing APTOS_NODE_URL environment variable');
        process.exit(1);
    }

    try {
        // Create AI trading bot with custom settings
        const bot = new AITradingBot(
            process.env.APTOS_NODE_URL,
            Date.now(), // Strategy ID
            {
                minConfidence: 0.8,    // Only execute trades with 80% or higher confidence
                checkInterval: 30000,   // Check for trading signals every 30 seconds
            }
        );

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

    } catch (error) {
        console.error('Error running trading bot:', error);
        process.exit(1);
    }
}

main().catch(console.error);
