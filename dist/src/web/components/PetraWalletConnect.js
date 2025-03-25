import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AccountBalanceWallet, Warning } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Link, Typography, } from "@mui/material";
import React from "react";
import { usePetra } from "../providers/PetraProvider";
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
    const { account, connect, disconnect, isConnecting, error, isPetraInstalled, network, } = usePetra();
    const [dialogOpen, setDialogOpen] = React.useState(false);
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
    return (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "contained", color: account ? "success" : "primary", onClick: handleOpenDialog, startIcon: account ? _jsx(AccountBalanceWallet, {}) : _jsx(Warning, {}), disabled: isConnecting, children: isConnecting ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : account ? (shortenAddress(account)) : !isPetraInstalled ? ("Install Petra") : ("Connect Wallet") }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: account ? "Wallet Information" : "Connect Wallet" }), _jsxs(DialogContent, { children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), !isPetraInstalled ? (_jsxs(Box, { sx: { textAlign: "center", py: 2 }, children: [_jsx(Typography, { variant: "body1", gutterBottom: true, children: "Petra wallet is required to use this application." }), _jsx(Link, { href: "https://petra.app/", target: "_blank", rel: "noopener noreferrer", sx: { display: "block", mt: 2 }, children: "Click here to install Petra wallet" })] })) : account ? (_jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Connected Address:" }), _jsx(Typography, { variant: "body1", sx: { wordBreak: "break-all" }, children: account }), _jsx(Typography, { variant: "subtitle1", gutterBottom: true, sx: { mt: 2 }, children: "Network:" }), _jsx(Typography, { variant: "body1", children: getNetworkName(network) })] })) : (_jsxs(Box, { sx: { textAlign: "center", py: 2 }, children: [_jsx(Typography, { variant: "body1", gutterBottom: true, children: "Click the button below to connect your Petra wallet." }), _jsx(Button, { variant: "contained", color: "primary", onClick: handleConnect, disabled: isConnecting, sx: { mt: 2 }, children: isConnecting ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : ("Connect Petra") })] }))] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setDialogOpen(false), children: "Close" }), account && (_jsx(Button, { onClick: handleDisconnect, color: "error", children: "Disconnect" }))] })] })] }));
};
export default PetraWalletConnect;
