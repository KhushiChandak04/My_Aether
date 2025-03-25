import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
const WalletButton = ({ onConnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [address, setAddress] = useState(null);
    const handleConnect = async () => {
        try {
            setIsConnecting(true);
            await onConnect();
            const response = await fetch('http://localhost:3001/api/create-wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setAddress(data.address);
        }
        catch (error) {
            console.error('Failed to connect wallet:', error);
        }
        finally {
            setIsConnecting(false);
        }
    };
    return (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [_jsx(Button, { variant: "contained", color: "primary", onClick: handleConnect, disabled: isConnecting || !!address, startIcon: _jsx(AccountBalanceWalletIcon, {}), children: isConnecting ? 'Connecting...' : address ? 'Connected' : 'Connect Wallet' }), address && (_jsx(Typography, { variant: "body2", color: "textSecondary", children: `${address.slice(0, 6)}...${address.slice(-4)}` }))] }));
};
export default WalletButton;
