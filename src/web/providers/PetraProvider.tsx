import { AptosWalletAdapterProvider, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface PetraContextType {
  account: string | null;
  network: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: string | null;
  isPetraInstalled: boolean;
}

const PetraContext = createContext<PetraContextType>({
  account: null,
  network: null,
  connect: async () => {},
  disconnect: () => {},
  isConnecting: false,
  error: null,
  isPetraInstalled: false,
});

export const usePetra = () => useContext(PetraContext);

interface PetraProviderProps {
  children: ReactNode;
}

/**
 * Inner provider that bridges @aptos-labs/wallet-adapter-react's useWallet
 * to the existing usePetra() interface used throughout the app.
 */
const PetraBridge: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    connect: adapterConnect,
    disconnect: adapterDisconnect,
    account: adapterAccount,
    connected,
    wallet,
    wallets,
    network: adapterNetwork,
  } = useWallet();

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derive whether Petra (or any AIP-62 wallet) is available
  const isPetraInstalled = useMemo(() => {
    return wallets.some(
      (w) => w.name.toLowerCase().includes("petra")
    );
  }, [wallets]);

  // Derive account address
  const account = useMemo(() => {
    if (connected && adapterAccount?.address) {
      return adapterAccount.address.toString();
    }
    return null;
  }, [connected, adapterAccount]);

  // Derive network name
  const networkName = useMemo(() => {
    if (adapterNetwork?.name) {
      return adapterNetwork.name.toString();
    }
    return null;
  }, [adapterNetwork]);

  // Log connection status changes
  useEffect(() => {
    if (connected && account) {
      console.log("Wallet connected:", account);
    }
  }, [connected, account]);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Find the Petra wallet from available wallets
      const petraWallet = wallets.find(
        (w) => w.name.toLowerCase().includes("petra")
      );

      if (!petraWallet) {
        setError(
          "Petra wallet not found. Please install Petra wallet from https://petra.app/"
        );
        return;
      }

      console.log("Connecting via Wallet Standard...");
      await adapterConnect(petraWallet.name);
      console.log("Wallet connected successfully");
    } catch (err: any) {
      console.error("Failed to connect wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    console.log("Disconnecting wallet...");
    try {
      await adapterDisconnect();
      setError(null);
    } catch (err: any) {
      console.error("Error disconnecting wallet:", err);
      setError(err.message || "Failed to disconnect wallet");
    }
  };

  return (
    <PetraContext.Provider
      value={{
        account,
        network: networkName,
        connect,
        disconnect,
        isConnecting,
        error,
        isPetraInstalled,
      }}
    >
      {children}
    </PetraContext.Provider>
  );
};

/**
 * Top-level provider that wraps the Aptos Wallet Adapter and exposes
 * the legacy usePetra() hook interface for backward compatibility.
 */
export const PetraProvider: React.FC<PetraProviderProps> = ({ children }) => {
  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: Network.MAINNET,
      }}
      onError={(err) => {
        console.error("Wallet adapter error:", err);
      }}
    >
      <PetraBridge>{children}</PetraBridge>
    </AptosWalletAdapterProvider>
  );
};
