import { ethers } from 'ethers';

declare global {
    interface Window {
        ethereum?: any;
    }
}

export interface WalletInfo {
    address: string;
    balance: string;
    chainId: number;
    network: string;
}

class WalletService {
    private provider: ethers.providers.Web3Provider | null = null;
    private signer: ethers.Signer | null = null;

    async connectWallet(): Promise<WalletInfo> {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }

        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner();
            
            const address = await this.signer.getAddress();
            const balance = ethers.utils.formatEther(await this.provider.getBalance(address));
            const network = await this.provider.getNetwork();
            
            return {
                address,
                balance,
                chainId: network.chainId,
                network: network.name
            };
        } catch (error) {
            console.error('Error connecting wallet:', error);
            throw error;
        }
    }

    async switchNetwork(chainId: number): Promise<void> {
        if (!this.provider) {
            throw new Error('Wallet not connected');
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chainId.toString(16)}` }],
            });
        } catch (error: any) {
            if (error.code === 4902) {
                // Chain not added, implement add chain logic here
                throw new Error('Network not available in MetaMask');
            }
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        this.provider = null;
        this.signer = null;
    }

    isConnected(): boolean {
        return this.provider !== null;
    }
}

export const walletService = new WalletService();
