import { AetherAI } from './index';
import * as dotenv from 'dotenv';
import { Types } from 'aptos';

dotenv.config();

async function main() {
    console.log('Starting AetherAI trading system...');
    
    if (!process.env.APTOS_NODE_URL) {
        console.error('Error: Missing APTOS_NODE_URL environment variable.');
        return;
    }

    try {
        // Initialize AetherAI
        const ai = new AetherAI(process.env.APTOS_NODE_URL);
        
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
        const strategyTxn = await ai.registerStrategy(
            'LSTM_Mean_Reversion',
            JSON.stringify(strategyParams)
        );

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
        const tradeTxn = await ai.executeTrade(
            Date.now(), // Use current timestamp as strategy ID
            tradeParams.action,
            tradeParams.amount,
            tradeParams.price
        );

        // Display final status
        console.log('\nAI Trading Session Summary:');
        console.log('Strategy Registration:', `https://explorer.aptoslabs.com/txn/${strategyTxn.hash}?network=devnet`);
        console.log('Trade Execution:', `https://explorer.aptoslabs.com/txn/${tradeTxn.hash}?network=devnet`);

    } catch (error) {
        console.error('\nError occurred:');
        if (error instanceof Error) {
            console.error('Message:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
        process.exit(1);
    }
}

main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});
