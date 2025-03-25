import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from "react";
const PetraContext = createContext({
    account: null,
    network: null,
    connect: async () => { },
    disconnect: () => { },
    isConnecting: false,
    error: null,
    isPetraInstalled: false,
});
export const usePetra = () => useContext(PetraContext);
export const PetraProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [network, setNetwork] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [isPetraInstalled, setIsPetraInstalled] = useState(false);
    // Check if Petra is installed
    useEffect(() => {
        const checkPetra = () => {
            const isInstalled = typeof window !== "undefined" && !!window.aptos;
            console.log("Petra wallet installed:", isInstalled);
            setIsPetraInstalled(isInstalled);
            if (!isInstalled) {
                setError("Please install Petra wallet to use this application. Visit https://petra.app/");
            }
            return isInstalled;
        };
        checkPetra();
    }, []);
    // Initialize and check for existing connection
    useEffect(() => {
        const initPetra = async () => {
            if (!window.aptos) {
                console.log("Petra wallet not found during initialization");
                setError("Please install Petra wallet to use this application");
                return;
            }
            try {
                console.log("Initializing Petra wallet...");
                // Check if already connected
                const isConnected = await window.aptos.isConnected();
                if (isConnected) {
                    const accountInfo = await window.aptos.account();
                    if (accountInfo) {
                        console.log("Found existing account:", accountInfo.address);
                        setAccount(accountInfo.address);
                        const networkInfo = await window.aptos.network();
                        setNetwork(networkInfo.name);
                    }
                }
                else {
                    console.log("No existing account found");
                }
            }
            catch (err) {
                console.error("Failed to initialize Petra wallet:", err);
                setError("Failed to initialize Petra wallet. Please refresh the page and try again.");
            }
        };
        initPetra();
    }, []);
    // Setup event listeners
    useEffect(() => {
        if (!window.aptos) {
            console.log("Petra wallet not found during event setup");
            return;
        }
        const handleAccountChange = (address) => {
            console.log("Account changed:", address);
            setAccount(address);
            if (!address) {
                setError("Please connect your Petra wallet");
            }
            else {
                setError(null);
            }
        };
        const handleNetworkChange = (networkInfo) => {
            console.log("Network changed:", networkInfo.name);
            setNetwork(networkInfo.name);
        };
        window.aptos.onAccountChange(handleAccountChange);
        window.aptos.onNetworkChange(handleNetworkChange);
        // No need for cleanup as Petra wallet handles this internally
    }, []);
    const connect = async () => {
        if (!window.aptos) {
            const error = "Petra wallet not found. Please install Petra wallet from https://petra.app/";
            console.error(error);
            setError(error);
            return;
        }
        setIsConnecting(true);
        setError(null);
        try {
            console.log("Requesting account access...");
            // Request account access
            const response = await window.aptos.connect();
            console.log("Account:", response.address);
            // Get network info
            const networkInfo = await window.aptos.network();
            console.log("Network:", networkInfo.name);
            // Use the address directly as provided by Petra wallet
            // Aptos addresses have a different format than Ethereum addresses
            // and should not be normalized with Ethereum validation rules
            const aptosAddress = response.address;
            console.log("Aptos address:", aptosAddress);
            // Update state with the original address
            setAccount(aptosAddress);
            setNetwork(networkInfo.name);
        }
        catch (err) {
            console.error("Failed to connect wallet:", err);
            setError(err.message || "Failed to connect wallet");
            setAccount(null);
            setNetwork(null);
        }
        finally {
            setIsConnecting(false);
        }
    };
    const disconnect = async () => {
        console.log("Disconnecting wallet...");
        try {
            if (window.aptos) {
                await window.aptos.disconnect();
            }
            setAccount(null);
            setNetwork(null);
            setError(null);
        }
        catch (err) {
            console.error("Error disconnecting wallet:", err);
            setError(err.message || "Failed to disconnect wallet");
        }
    };
    return (_jsx(PetraContext.Provider, { value: {
            account,
            network,
            connect,
            disconnect,
            isConnecting,
            error,
            isPetraInstalled,
        }, children: children }));
};
