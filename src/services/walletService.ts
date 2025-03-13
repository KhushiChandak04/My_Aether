declare global {
  interface Window {
    aptos?: any;
  }
}

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
}

class WalletService {
  private connected: boolean = false;

  async connectWallet(): Promise<WalletInfo> {
    if (!window.aptos) {
      throw new Error("Petra wallet is not installed");
    }

    try {
      // Request account access
      const response = await window.aptos.connect();

      // Get account info
      const account = await window.aptos.account();
      if (!account) {
        throw new Error("Failed to get account information");
      }

      // Get network info
      const networkInfo = await window.aptos.network();

      // Get balance - Note: This is a simplified approach
      // In a real app, you would need to query the Aptos blockchain for the actual balance
      const balance = "0"; // Placeholder - would need actual API call to get balance

      this.connected = true;

      return {
        address: account.address,
        balance: balance,
        network: networkInfo.name,
      };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  }

  async switchNetwork(network: string): Promise<void> {
    if (!this.connected) {
      throw new Error("Wallet not connected");
    }

    try {
      // Note: Petra wallet doesn't have a direct method to switch networks
      // Users need to switch networks manually in the wallet interface
      throw new Error(
        "Network switching not supported directly. Please switch networks in the Petra wallet extension."
      );
    } catch (error: any) {
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (window.aptos) {
      try {
        await window.aptos.disconnect();
        this.connected = false;
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
        throw error;
      }
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const walletService = new WalletService();
