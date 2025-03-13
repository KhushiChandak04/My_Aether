import { AptosAccount, AptosClient, CoinClient, FaucetClient, HexString, Types } from "aptos";
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { ProtocolManager } from "./protocols/manager";

export class AIWallet {
    private account!: AptosAccount; // Using definite assignment assertion
    private client: AptosClient;
    private coinClient: CoinClient;
    private walletPath: string;
    public protocolManager: ProtocolManager;

    constructor(nodeUrl: string, walletDir: string = '.wallets') {
        this.client = new AptosClient(nodeUrl);
        this.coinClient = new CoinClient(this.client);
        this.walletPath = path.join(process.cwd(), walletDir);
        this.protocolManager = new ProtocolManager(this);
        
        // Ensure wallet directory exists
        if (!fs.existsSync(this.walletPath)) {
            fs.mkdirSync(this.walletPath, { recursive: true });
        }
    }

    /**
     * Create a new AI wallet with a fresh account
     */
    async create(label: string): Promise<{ address: string, privateKey: string }> {
        try {
            console.log('Generating new account...');
            // Generate new account
            const account = new AptosAccount();
            
            // Save wallet info
            const walletInfo = {
                address: account.address().hex(),
                privateKey: HexString.fromUint8Array(account.signingKey.secretKey).hex(),
                publicKey: account.pubKey().hex(),
                label,
                createdAt: new Date().toISOString()
            };

            // Save to file
            const filename = path.join(this.walletPath, `${label}.wallet`);
            this.saveWalletSecurely(filename, walletInfo);

            // Fund account on devnet
            if (process.env.NODE_ENV !== 'production') {
                console.log('Funding account on devnet...');
                const faucetClient = new FaucetClient(
                    this.client.nodeUrl,
                    'https://faucet.devnet.aptoslabs.com'
                );
                await faucetClient.fundAccount(account.address(), 100_000_000);
                console.log('Account funded successfully');
            }

            this.account = account;
            return {
                address: walletInfo.address,
                privateKey: walletInfo.privateKey
            };
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw error;
        }
    }

    /**
     * Load an existing wallet
     */
    async load(label: string): Promise<string> {
        try {
            console.log(`Loading wallet: ${label}`);
            const filename = path.join(this.walletPath, `${label}.wallet`);
            
            if (!fs.existsSync(filename)) {
                throw new Error(`Wallet file not found: ${filename}`);
            }

            console.log('Reading wallet file...');
            const walletInfo = this.loadWalletSecurely(filename);
            
            if (!walletInfo || !walletInfo.privateKey || !walletInfo.address) {
                throw new Error('Invalid wallet data');
            }

            console.log('Creating account from private key...');
            this.account = new AptosAccount(
                HexString.ensure(walletInfo.privateKey).toUint8Array()
            );

            // Verify the address matches
            const loadedAddress = this.account.address().hex();
            if (loadedAddress !== walletInfo.address) {
                throw new Error('Wallet address mismatch');
            }

            console.log('Wallet loaded successfully:', loadedAddress);
            return loadedAddress;
        } catch (error) {
            console.error('Error loading wallet:', error);
            // If there's an error loading the wallet, delete the corrupted file
            try {
                const filename = path.join(this.walletPath, `${label}.wallet`);
                if (fs.existsSync(filename)) {
                    fs.unlinkSync(filename);
                    console.log('Removed corrupted wallet file');
                }
            } catch (deleteError) {
                console.error('Error removing corrupted wallet:', deleteError);
            }
            throw error;
        }
    }

    /**
     * Get wallet balance
     */
    async getBalance(): Promise<bigint> {
        try {
            if (!this.account) {
                throw new Error('No wallet loaded');
            }

            const balance = await this.coinClient.checkBalance(this.account);
            console.log('Current balance:', balance.toString(), 'Octas');
            return balance;
        } catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }

    /**
     * Sign a transaction
     */
    async signTransaction(txnPayload: Types.EntryFunctionPayload): Promise<Types.UserTransaction> {
        if (!this.account) {
            throw new Error('No wallet loaded');
        }

        const rawTxn = await this.client.generateTransaction(
            this.account.address(),
            txnPayload
        );
        
        const signedTxn = await this.client.signTransaction(this.account, rawTxn);
        const pendingTxn = await this.client.submitTransaction(signedTxn);
        await this.client.waitForTransaction(pendingTxn.hash);
        return await this.client.getTransactionByHash(pendingTxn.hash) as Types.UserTransaction;
    }

    /**
     * Submit a signed transaction
     */
    async submitTransaction(txnPayload: Types.EntryFunctionPayload): Promise<Types.UserTransaction> {
        if (!this.account) {
            throw new Error('No wallet loaded');
        }
        return await this.signTransaction(txnPayload);
    }

    private saveWalletSecurely(filename: string, data: any): void {
        try {
            // In a production environment, use proper encryption
            // This is a simplified version for demonstration
            const encryptedData = JSON.stringify(data, null, 2);
            
            // Write to a temporary file first
            const tempFile = `${filename}.tmp`;
            fs.writeFileSync(tempFile, encryptedData, 'utf8');
            
            // Verify the data can be read back correctly
            const verifyData = JSON.parse(fs.readFileSync(tempFile, 'utf8'));
            if (!verifyData || !verifyData.privateKey || !verifyData.address) {
                throw new Error('Wallet data verification failed');
            }
            
            // If verification passes, move the temp file to the final location
            fs.renameSync(tempFile, filename);
            console.log('Wallet saved successfully:', filename);
        } catch (error) {
            console.error('Error saving wallet:', error);
            throw error;
        }
    }

    private loadWalletSecurely(filename: string): any {
        try {
            // In a production environment, use proper decryption
            // This is a simplified version for demonstration
            const encryptedData = fs.readFileSync(filename, 'utf8');
            const data = JSON.parse(encryptedData);
            
            // Validate wallet data structure
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid wallet data format');
            }
            
            const requiredFields = ['address', 'privateKey', 'publicKey', 'label', 'createdAt'];
            for (const field of requiredFields) {
                if (!(field in data)) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }
            
            return data;
        } catch (error) {
            console.error('Error loading wallet data:', error);
            throw error;
        }
    }

    /**
     * Get the current account's address
     */
    getAddress(): string {
        if (!this.account) {
            throw new Error('No wallet loaded');
        }
        return this.account.address().hex();
    }

    /**
     * Check if a wallet exists
     */
    exists(label: string): boolean {
        const filename = path.join(this.walletPath, `${label}.wallet`);
        return fs.existsSync(filename);
    }
}
