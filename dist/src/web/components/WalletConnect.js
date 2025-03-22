"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const Web3Provider_1 = require("../providers/Web3Provider");
const getNetworkName = (chainId) => {
    if (!chainId)
        return 'Unknown Network';
    switch (chainId) {
        case 1:
            return 'Ethereum Mainnet';
        case 3:
            return 'Ropsten Testnet';
        case 4:
            return 'Rinkeby Testnet';
        case 5:
            return 'Goerli Testnet';
        case 42:
            return 'Kovan Testnet';
        case 137:
            return 'Polygon Mainnet';
        case 80001:
            return 'Mumbai Testnet';
        default:
            return `Chain ID: ${chainId}`;
    }
};
const WalletConnect = () => {
    const { account, connect, disconnect, isConnecting, error, isMetaMaskInstalled, chainId } = (0, Web3Provider_1.useWeb3)();
    const [dialogOpen, setDialogOpen] = react_1.default.useState(false);
    const handleConnect = async () => {
        if (!isMetaMaskInstalled) {
            window.open('https://metamask.io/download/', '_blank');
            return;
        }
        await connect();
    };
    const handleDisconnect = () => {
        disconnect();
        setDialogOpen(false);
    };
    const shortenAddress = (address) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };
    const handleOpenDialog = () => {
        if (account) {
            setDialogOpen(true);
        }
        else {
            handleConnect();
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: account ? "success" : "primary", onClick: handleOpenDialog, startIcon: account ? (0, jsx_runtime_1.jsx)(icons_material_1.AccountBalanceWallet, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.Warning, {}), disabled: isConnecting, children: isConnecting ? ((0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 24, color: "inherit" })) : account ? (shortenAddress(account)) : !isMetaMaskInstalled ? ('Install MetaMask') : ('Connect Wallet') }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: account ? 'Wallet Information' : 'Connect Wallet' }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [error && ((0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", sx: { mb: 2 }, children: error })), !isMetaMaskInstalled ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { textAlign: 'center', py: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", gutterBottom: true, children: "MetaMask is required to use this application." }), (0, jsx_runtime_1.jsx)(material_1.Link, { href: "https://metamask.io/download/", target: "_blank", rel: "noopener noreferrer", sx: { display: 'block', mt: 2 }, children: "Click here to install MetaMask" })] })) : account ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", gutterBottom: true, children: "Connected Address:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", sx: { wordBreak: 'break-all' }, children: account }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", gutterBottom: true, sx: { mt: 2 }, children: "Network:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: getNetworkName(chainId) })] })) : ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { textAlign: 'center', py: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", gutterBottom: true, children: "Click the button below to connect your MetaMask wallet." }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleConnect, disabled: isConnecting, sx: { mt: 2 }, children: isConnecting ? ((0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 24, color: "inherit" })) : ('Connect MetaMask') })] }))] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setDialogOpen(false), children: "Close" }), account && ((0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleDisconnect, color: "error", children: "Disconnect" }))] })] })] }));
};
exports.default = WalletConnect;
