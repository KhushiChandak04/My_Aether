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
exports.AIWallet = void 0;
const aptos_1 = require("aptos");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const manager_1 = require("./protocols/manager");
class AIWallet {
    constructor(nodeUrl, walletDir = '.wallets') {
        this.client = new aptos_1.AptosClient(nodeUrl);
        this.coinClient = new aptos_1.CoinClient(this.client);
        this.walletPath = path.join(process.cwd(), walletDir);
        this.protocolManager = new manager_1.ProtocolManager(this);
        // Ensure wallet directory exists
        if (!fs.existsSync(this.walletPath)) {
            fs.mkdirSync(this.walletPath, { recursive: true });
        }
    }
    /**
     * Create a new AI wallet with a fresh account
     */
    async create(label) {
        try {
            console.log('Generating new account...');
            // Generate new account
            const account = new aptos_1.AptosAccount();
            // Save wallet info
            const walletInfo = {
                address: account.address().hex(),
                privateKey: aptos_1.HexString.fromUint8Array(account.signingKey.secretKey).hex(),
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
                const faucetClient = new aptos_1.FaucetClient(this.client.nodeUrl, 'https://faucet.devnet.aptoslabs.com');
                await faucetClient.fundAccount(account.address(), 100000000);
                console.log('Account funded successfully');
            }
            this.account = account;
            return {
                address: walletInfo.address,
                privateKey: walletInfo.privateKey
            };
        }
        catch (error) {
            console.error('Error creating wallet:', error);
            throw error;
        }
    }
    /**
     * Load an existing wallet
     */
    async load(label) {
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
            this.account = new aptos_1.AptosAccount(aptos_1.HexString.ensure(walletInfo.privateKey).toUint8Array());
            // Verify the address matches
            const loadedAddress = this.account.address().hex();
            if (loadedAddress !== walletInfo.address) {
                throw new Error('Wallet address mismatch');
            }
            console.log('Wallet loaded successfully:', loadedAddress);
            return loadedAddress;
        }
        catch (error) {
            console.error('Error loading wallet:', error);
            // If there's an error loading the wallet, delete the corrupted file
            try {
                const filename = path.join(this.walletPath, `${label}.wallet`);
                if (fs.existsSync(filename)) {
                    fs.unlinkSync(filename);
                    console.log('Removed corrupted wallet file');
                }
            }
            catch (deleteError) {
                console.error('Error removing corrupted wallet:', deleteError);
            }
            throw error;
        }
    }
    /**
     * Get wallet balance
     */
    async getBalance() {
        try {
            if (!this.account) {
                throw new Error('No wallet loaded');
            }
            const balance = await this.coinClient.checkBalance(this.account);
            console.log('Current balance:', balance.toString(), 'Octas');
            return balance;
        }
        catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }
    /**
     * Sign a transaction
     */
    async signTransaction(txnPayload) {
        if (!this.account) {
            throw new Error('No wallet loaded');
        }
        const rawTxn = await this.client.generateTransaction(this.account.address(), txnPayload);
        const signedTxn = await this.client.signTransaction(this.account, rawTxn);
        const pendingTxn = await this.client.submitTransaction(signedTxn);
        await this.client.waitForTransaction(pendingTxn.hash);
        return await this.client.getTransactionByHash(pendingTxn.hash);
    }
    /**
     * Submit a signed transaction
     */
    async submitTransaction(txnPayload) {
        if (!this.account) {
            throw new Error('No wallet loaded');
        }
        return await this.signTransaction(txnPayload);
    }
    saveWalletSecurely(filename, data) {
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
        }
        catch (error) {
            console.error('Error saving wallet:', error);
            throw error;
        }
    }
    loadWalletSecurely(filename) {
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
        }
        catch (error) {
            console.error('Error loading wallet data:', error);
            throw error;
        }
    }
    /**
     * Get the current account's address
     */
    getAddress() {
        if (!this.account) {
            throw new Error('No wallet loaded');
        }
        return this.account.address().hex();
    }
    /**
     * Check if a wallet exists
     */
    exists(label) {
        const filename = path.join(this.walletPath, `${label}.wallet`);
        return fs.existsSync(filename);
    }
}
exports.AIWallet = AIWallet;
