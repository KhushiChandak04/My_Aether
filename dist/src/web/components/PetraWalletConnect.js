"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_material_1 = require("@mui/icons-material");
const material_1 = require("@mui/material");
const react_1 = __importDefault(require("react"));
const PetraProvider_1 = require("../providers/PetraProvider");
const getNetworkName = (network) => {
    if (!network)
        return "Unknown Network";
    // Format network name for display
    switch (network.toLowerCase()) {
        case "mainnet":
            return "Aptos Mainnet";
        case "testnet":
            return "Aptos Testnet";
        case "devnet":
            return "Aptos Devnet";
        default:
            return network;
    }
};
const PetraWalletConnect = () => {
    const { account, connect, disconnect, isConnecting, error, isPetraInstalled, network, } = (0, PetraProvider_1.usePetra)();
    const [dialogOpen, setDialogOpen] = react_1.default.useState(false);
    const handleConnect = async () => {
        if (!isPetraInstalled) {
            window.open("https://petra.app/", "_blank");
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
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: account ? "success" : "primary", onClick: handleOpenDialog, startIcon: account ? (0, jsx_runtime_1.jsx)(icons_material_1.AccountBalanceWallet, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.Warning, {}), disabled: isConnecting, children: isConnecting ? ((0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 24, color: "inherit" })) : account ? (shortenAddress(account)) : !isPetraInstalled ? ("Install Petra") : ("Connect Wallet") }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: account ? "Wallet Information" : "Connect Wallet" }), (0, jsx_runtime_1.jsxs)(material_1.DialogContent, { children: [error && ((0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", sx: { mb: 2 }, children: error })), !isPetraInstalled ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { textAlign: "center", py: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", gutterBottom: true, children: "Petra wallet is required to use this application." }), (0, jsx_runtime_1.jsx)(material_1.Link, { href: "https://petra.app/", target: "_blank", rel: "noopener noreferrer", sx: { display: "block", mt: 2 }, children: "Click here to install Petra wallet" })] })) : account ? ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", gutterBottom: true, children: "Connected Address:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", sx: { wordBreak: "break-all" }, children: account }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", gutterBottom: true, sx: { mt: 2 }, children: "Network:" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", children: getNetworkName(network) })] })) : ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { textAlign: "center", py: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", gutterBottom: true, children: "Click the button below to connect your Petra wallet." }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleConnect, disabled: isConnecting, sx: { mt: 2 }, children: isConnecting ? ((0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 24, color: "inherit" })) : ("Connect Petra") })] }))] }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setDialogOpen(false), children: "Close" }), account && ((0, jsx_runtime_1.jsx)(material_1.Button, { onClick: handleDisconnect, color: "error", children: "Disconnect" }))] })] })] }));
};
exports.default = PetraWalletConnect;
