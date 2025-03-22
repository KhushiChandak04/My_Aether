"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Provider = exports.useWeb3 = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const web3_1 = __importDefault(require("web3"));
const Web3Context = (0, react_1.createContext)({
    web3: null,
    account: null,
    chainId: null,
    connect: async () => { },
    disconnect: () => { },
    isConnecting: false,
    error: null,
    isMetaMaskInstalled: false,
});
const useWeb3 = () => (0, react_1.useContext)(Web3Context);
exports.useWeb3 = useWeb3;
const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = (0, react_1.useState)(null);
    const [account, setAccount] = (0, react_1.useState)(null);
    const [chainId, setChainId] = (0, react_1.useState)(null);
    const [isConnecting, setIsConnecting] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = (0, react_1.useState)(false);
    // Check if MetaMask is installed
    (0, react_1.useEffect)(() => {
        const checkMetaMask = () => {
            const isInstalled = typeof window !== 'undefined' &&
                !!window.ethereum &&
                !!window.ethereum.isMetaMask;
            console.log('MetaMask installed:', isInstalled);
            setIsMetaMaskInstalled(isInstalled);
            if (!isInstalled) {
                setError('Please install MetaMask to use this application. Visit https://metamask.io/download/');
            }
            return isInstalled;
        };
        checkMetaMask();
    }, []);
    // Initialize Web3 and check for existing connection
    (0, react_1.useEffect)(() => {
        const initWeb3 = async () => {
            if (!window.ethereum?.isMetaMask) {
                console.log('MetaMask not found during initialization');
                setError('Please install MetaMask to use this application');
                return;
            }
            try {
                console.log('Initializing Web3...');
                const provider = window.ethereum;
                const web3Instance = new web3_1.default(provider);
                setWeb3(web3Instance);
                // Check if already connected
                const accounts = await provider.request({
                    method: 'eth_accounts',
                });
                if (accounts.length > 0) {
                    console.log('Found existing account:', accounts[0]);
                    setAccount(accounts[0]);
                    const chainId = await provider.request({
                        method: 'eth_chainId',
                    });
                    setChainId(parseInt(chainId, 16));
                }
                else {
                    console.log('No existing account found');
                }
            }
            catch (err) {
                console.error('Failed to initialize Web3:', err);
                setError('Failed to initialize Web3. Please refresh the page and try again.');
            }
        };
        initWeb3();
    }, []);
    // Setup event listeners
    (0, react_1.useEffect)(() => {
        const provider = window.ethereum;
        if (!provider?.isMetaMask) {
            console.log('MetaMask not found during event setup');
            return;
        }
        const handleAccountsChanged = (accounts) => {
            console.log('Accounts changed:', accounts);
            if (accounts.length > 0) {
                setAccount(accounts[0]);
            }
            else {
                setAccount(null);
                setError('Please connect your MetaMask wallet');
            }
        };
        const handleChainChanged = (chainId) => {
            console.log('Chain changed:', chainId);
            setChainId(parseInt(chainId, 16));
        };
        const handleDisconnect = (error) => {
            console.log('Disconnect:', error);
            setAccount(null);
            setChainId(null);
            if (error.code === 1013) { // Code for chain/network changed
                setError('Please switch to a supported network');
            }
        };
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('chainChanged', handleChainChanged);
        provider.on('disconnect', handleDisconnect);
        return () => {
            provider.removeListener('accountsChanged', handleAccountsChanged);
            provider.removeListener('chainChanged', handleChainChanged);
            provider.removeListener('disconnect', handleDisconnect);
        };
    }, []);
    const connect = async () => {
        const provider = window.ethereum;
        if (!provider?.isMetaMask) {
            const error = 'MetaMask not found. Please install MetaMask from https://metamask.io/download/';
            console.error(error);
            setError(error);
            return;
        }
        setIsConnecting(true);
        setError(null);
        try {
            console.log('Requesting account access...');
            // Request account access
            const accounts = await provider.request({
                method: 'eth_requestAccounts',
            });
            console.log('Accounts:', accounts);
            // Get chain ID
            const chainId = await provider.request({
                method: 'eth_chainId',
            });
            console.log('Chain ID:', chainId);
            // Update state
            setAccount(accounts[0]);
            setChainId(parseInt(chainId, 16));
            // Initialize Web3 instance if not already done
            if (!web3) {
                const web3Instance = new web3_1.default(provider);
                setWeb3(web3Instance);
            }
        }
        catch (err) {
            console.error('Failed to connect wallet:', err);
            if (err.code === 4001) {
                setError('Please accept the connection request in MetaMask');
            }
            else if (err.code === -32002) {
                setError('MetaMask is already processing a request. Please check your MetaMask extension.');
            }
            else {
                setError(err.message || 'Failed to connect wallet');
            }
            setAccount(null);
            setChainId(null);
        }
        finally {
            setIsConnecting(false);
        }
    };
    const disconnect = () => {
        console.log('Disconnecting wallet...');
        setAccount(null);
        setChainId(null);
        setError(null);
    };
    return ((0, jsx_runtime_1.jsx)(Web3Context.Provider, { value: {
            web3,
            account,
            chainId,
            connect,
            disconnect,
            isConnecting,
            error,
            isMetaMaskInstalled,
        }, children: children }));
};
exports.Web3Provider = Web3Provider;
