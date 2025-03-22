"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AetherAI = void 0;
const aptos_1 = require("aptos");
const wallet_1 = require("./wallet");
class AetherAI {
    constructor(nodeUrl) {
        this.client = new aptos_1.AptosClient(nodeUrl);
        this.wallet = new wallet_1.AIWallet(nodeUrl);
        this.moduleAddress = '0x23306993ed0d0feb8ef9d97cd6853cf54b21ac058a5c2fddda801020cb7c5789';
    }
    /**
     * Check if a wallet is loaded
     */
    hasWallet() {
        return this.wallet && this.wallet.exists('trading_bot');
    }
    /**
     * Get the current wallet address
     */
    async getWalletAddress() {
        if (!this.wallet) {
            throw new Error('No wallet instance available');
        }
        return this.wallet.getAddress();
    }
    /**
     * Get the current wallet balance
     */
    async getWalletBalance() {
        if (!this.wallet) {
            throw new Error('No wallet instance available');
        }
        return await this.wallet.getBalance();
    }
    /**
     * Fund wallet with test tokens (devnet only)
     */
    async fundWalletForTesting() {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot fund wallet in production');
        }
        if (!this.wallet) {
            throw new Error('No wallet instance available');
        }
        const faucetClient = new aptos_1.FaucetClient(this.client.nodeUrl, 'https://faucet.devnet.aptoslabs.com');
        const address = await this.getWalletAddress();
        await faucetClient.fundAccount(address, 100000000);
    }
    /**
     * Initialize AI trading wallet
     */
    async initializeWallet(label = 'ai_trader') {
        try {
            console.log('Initializing wallet...');
            let address;
            // Always try to create a new wallet first
            console.log('Creating new wallet...');
            const walletInfo = await this.wallet.create(label);
            address = walletInfo.address;
            console.log('AI trading wallet initialized:');
            console.log('Wallet address:', address);
            console.log('Module address:', this.moduleAddress);
            const balance = await this.wallet.getBalance();
            console.log('Current balance:', balance.toString(), 'Octas');
            return address;
        }
        catch (error) {
            console.error('Wallet initialization error:', error);
            throw error;
        }
    }
    async registerStrategy(name, parameters) {
        try {
            const payload = {
                type: "entry_function_payload",
                function: `${this.moduleAddress}::ai_trader::register_strategy`,
                type_arguments: [],
                arguments: [
                    Array.from(Buffer.from(name)),
                    Array.from(Buffer.from(parameters))
                ]
            };
            const transaction = await this.wallet.submitTransaction(payload);
            console.log('Strategy registered successfully!');
            console.log('Transaction hash:', transaction.hash);
            console.log('View transaction at:', `https://explorer.aptoslabs.com/txn/${transaction.hash}?network=devnet`);
            return transaction;
        }
        catch (error) {
            console.error('Error registering strategy:', error);
            throw error;
        }
    }
    async executeTrade(strategyId, action, amount, price) {
        try {
            // Convert amount and price to Octas (1 APT = 100_000_000 Octas)
            const amountInOctas = Math.floor(amount * 100000000);
            const priceInOctas = Math.floor(price * 100000000);
            // Validate inputs
            if (amountInOctas <= 0) {
                throw new Error('Trade amount must be greater than 0');
            }
            if (priceInOctas <= 0) {
                throw new Error('Trade price must be greater than 0');
            }
            // Check wallet balance for buys
            if (action.toUpperCase() === 'BUY') {
                const balance = await this.getWalletBalance();
                const totalCost = BigInt(amountInOctas) * BigInt(priceInOctas);
                if (balance < totalCost) {
                    throw new Error(`Insufficient balance. Required: ${totalCost.toString()} Octas, Available: ${balance.toString()} Octas`);
                }
            }
            const payload = {
                type: "entry_function_payload",
                function: `${this.moduleAddress}::ai_trader::execute_trade`,
                type_arguments: ["0x1::aptos_coin::AptosCoin"],
                arguments: [
                    strategyId,
                    Array.from(Buffer.from(action.toUpperCase())),
                    amountInOctas.toString(),
                    priceInOctas.toString()
                ]
            };
            console.log('Executing trade with payload:', {
                strategyId,
                action: action.toUpperCase(),
                amount: amountInOctas.toString(),
                price: priceInOctas.toString()
            });
            const transaction = await this.wallet.submitTransaction(payload);
            console.log('Trade executed successfully!');
            console.log('Transaction hash:', transaction.hash);
            console.log('View transaction at:', `https://explorer.aptoslabs.com/txn/${transaction.hash}?network=devnet`);
            return transaction;
        }
        catch (error) {
            console.error('Error executing trade:', error);
            throw error;
        }
    }
    async updateStrategy(strategyId, newParameters) {
        try {
            const payload = {
                type: "entry_function_payload",
                function: `${this.moduleAddress}::ai_trader::update_strategy`,
                type_arguments: [],
                arguments: [
                    strategyId,
                    Array.from(Buffer.from(newParameters))
                ]
            };
            const transaction = await this.wallet.submitTransaction(payload);
            console.log('Strategy updated successfully!');
            console.log('Transaction hash:', transaction.hash);
            console.log('View transaction at:', `https://explorer.aptoslabs.com/txn/${transaction.hash}?network=devnet`);
            return transaction;
        }
        catch (error) {
            console.error('Error updating strategy:', error);
            throw error;
        }
    }
}
exports.AetherAI = AetherAI;
