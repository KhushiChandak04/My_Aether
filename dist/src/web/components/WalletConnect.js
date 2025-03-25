import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Alert, CircularProgress, Link, } from '@mui/material';
import { AccountBalanceWallet, Warning } from '@mui/icons-material';
import { useWeb3 } from '../providers/Web3Provider';
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
    const { account, connect, disconnect, isConnecting, error, isMetaMaskInstalled, chainId } = useWeb3();
    const [dialogOpen, setDialogOpen] = React.useState(false);
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
    return (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "contained", color: account ? "success" : "primary", onClick: handleOpenDialog, startIcon: account ? _jsx(AccountBalanceWallet, {}) : _jsx(Warning, {}), disabled: isConnecting, children: isConnecting ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : account ? (shortenAddress(account)) : !isMetaMaskInstalled ? ('Install MetaMask') : ('Connect Wallet') }), _jsxs(Dialog, { open: dialogOpen, onClose: () => setDialogOpen(false), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: account ? 'Wallet Information' : 'Connect Wallet' }), _jsxs(DialogContent, { children: [error && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error })), !isMetaMaskInstalled ? (_jsxs(Box, { sx: { textAlign: 'center', py: 2 }, children: [_jsx(Typography, { variant: "body1", gutterBottom: true, children: "MetaMask is required to use this application." }), _jsx(Link, { href: "https://metamask.io/download/", target: "_blank", rel: "noopener noreferrer", sx: { display: 'block', mt: 2 }, children: "Click here to install MetaMask" })] })) : account ? (_jsxs(Box, { sx: { mb: 2 }, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Connected Address:" }), _jsx(Typography, { variant: "body1", sx: { wordBreak: 'break-all' }, children: account }), _jsx(Typography, { variant: "subtitle1", gutterBottom: true, sx: { mt: 2 }, children: "Network:" }), _jsx(Typography, { variant: "body1", children: getNetworkName(chainId) })] })) : (_jsxs(Box, { sx: { textAlign: 'center', py: 2 }, children: [_jsx(Typography, { variant: "body1", gutterBottom: true, children: "Click the button below to connect your MetaMask wallet." }), _jsx(Button, { variant: "contained", color: "primary", onClick: handleConnect, disabled: isConnecting, sx: { mt: 2 }, children: isConnecting ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : ('Connect MetaMask') })] }))] }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setDialogOpen(false), children: "Close" }), account && (_jsx(Button, { onClick: handleDisconnect, color: "error", children: "Disconnect" }))] })] })] }));
};
export default WalletConnect;
