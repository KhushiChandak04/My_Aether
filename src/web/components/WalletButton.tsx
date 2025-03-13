import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface WalletButtonProps {
    onConnect: () => Promise<void>;
}

const WalletButton: React.FC<WalletButtonProps> = ({ onConnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

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
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleConnect}
                disabled={isConnecting || !!address}
                startIcon={<AccountBalanceWalletIcon />}
            >
                {isConnecting ? 'Connecting...' : address ? 'Connected' : 'Connect Wallet'}
            </Button>
            {address && (
                <Typography variant="body2" color="textSecondary">
                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </Typography>
            )}
        </div>
    );
};

export default WalletButton;
