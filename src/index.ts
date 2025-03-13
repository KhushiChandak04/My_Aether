import { AptosClient, Types, HexString, FaucetClient } from "aptos";
import { AIWallet } from './wallet';

export class AetherAI {
    private client: AptosClient;
    private wallet: AIWallet;
    private moduleAddress: string;

    constructor(nodeUrl: string) {
        this.client = new AptosClient(nodeUrl);
        this.wallet = new AIWallet(nodeUrl);
        this.moduleAddress = '0x23306993ed0d0feb8ef9d97cd6853cf54b21ac058a5c2fddda801020cb7c5789';
    }

    /**
     * Check if a wallet is loaded
     */
    hasWallet(): boolean {
        return this.wallet && this.wallet.exists('trading_bot');
    }

    /**
     * Get the current wallet address
     */
    async getWalletAddress(): Promise<string> {
        if (!this.wallet) {
            throw new Error('No wallet instance available');
        }
        return this.wallet.getAddress();
    }

    /**
     * Get the current wallet balance
     */
    async getWalletBalance(): Promise<bigint> {
        if (!this.wallet) {
            throw new Error('No wallet instance available');
        }
        return await this.wallet.getBalance();
    }

    /**
     * Fund wallet with test tokens (devnet only)
     */
    async fundWalletForTesting(): Promise<void> {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Cannot fund wallet in production');
        }

        if (!this.wallet) {
            throw new Error('No wallet instance available');
        }

        const faucetClient = new FaucetClient(
            this.client.nodeUrl,
            'https://faucet.devnet.aptoslabs.com'
        );

        const address = await this.getWalletAddress();
        await faucetClient.fundAccount(address, 100_000_000);
    }

    /**
     * Initialize AI trading wallet
     */
    async initializeWallet(label: string = 'ai_trader'): Promise<string> {
        try {
            console.log('Initializing wallet...');
            let address: string;

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
        } catch (error) {
            console.error('Wallet initialization error:', error);
            throw error;
        }
    }

    async registerStrategy(name: string, parameters: string): Promise<Types.UserTransaction> {
        try {
            const payload = {
                type: "entry_function_payload",
                function: `${this.moduleAddress}::ai_trader::register_strategy`,
                type_arguments: [],
                arguments: [
                    Array.from(Buffer.from(name)),
                    Array.from(Buffer.from(parameters))
                ]
            } as Types.EntryFunctionPayload;

            const transaction = await this.wallet.submitTransaction(payload);
            console.log('Strategy registered successfully!');
            console.log('Transaction hash:', transaction.hash);
            console.log('View transaction at:', `https://explorer.aptoslabs.com/txn/${transaction.hash}?network=devnet`);
            
            return transaction;
        } catch (error) {
            console.error('Error registering strategy:', error);
            throw error;
        }
    }

    async executeTrade(
        strategyId: number,
        action: string,
        amount: number,
        price: number
    ): Promise<Types.UserTransaction> {
        try {
            const payload = {
                type: "entry_function_payload",
                function: `${this.moduleAddress}::ai_trader::execute_trade`,
                type_arguments: ["0x1::aptos_coin::AptosCoin"],
                arguments: [
                    strategyId,
                    Array.from(Buffer.from(action)),
                    amount,
                    price
                ]
            } as Types.EntryFunctionPayload;

            const transaction = await this.wallet.submitTransaction(payload);
            console.log('Trade executed successfully!');
            console.log('Transaction hash:', transaction.hash);
            console.log('View transaction at:', `https://explorer.aptoslabs.com/txn/${transaction.hash}?network=devnet`);
            
            return transaction;
        } catch (error) {
            console.error('Error executing trade:', error);
            throw error;
        }
    }

    async updateStrategy(
        strategyId: number,
        newParameters: string
    ): Promise<Types.UserTransaction> {
        try {
            const payload = {
                type: "entry_function_payload",
                function: `${this.moduleAddress}::ai_trader::update_strategy`,
                type_arguments: [],
                arguments: [
                    strategyId,
                    Array.from(Buffer.from(newParameters))
                ]
            } as Types.EntryFunctionPayload;

            const transaction = await this.wallet.submitTransaction(payload);
            console.log('Strategy updated successfully!');
            console.log('Transaction hash:', transaction.hash);
            console.log('View transaction at:', `https://explorer.aptoslabs.com/txn/${transaction.hash}?network=devnet`);
            
            return transaction;
        } catch (error) {
            console.error('Error updating strategy:', error);
            throw error;
        }
    }
}
