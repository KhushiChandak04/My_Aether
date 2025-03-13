import React from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Link,
} from '@mui/material';
import { AccountBalanceWallet, Warning } from '@mui/icons-material';
import { useWeb3 } from '../providers/Web3Provider';

const getNetworkName = (chainId: number | null): string => {
    if (!chainId) return 'Unknown Network';
    
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

const WalletConnect: React.FC = () => {
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

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleOpenDialog = () => {
        if (account) {
            setDialogOpen(true);
        } else {
            handleConnect();
        }
    };

    return (
        <>
            <Button
                variant="contained"
                color={account ? "success" : "primary"}
                onClick={handleOpenDialog}
                startIcon={account ? <AccountBalanceWallet /> : <Warning />}
                disabled={isConnecting}
            >
                {isConnecting ? (
                    <CircularProgress size={24} color="inherit" />
                ) : account ? (
                    shortenAddress(account)
                ) : !isMetaMaskInstalled ? (
                    'Install MetaMask'
                ) : (
                    'Connect Wallet'
                )}
            </Button>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {account ? 'Wallet Information' : 'Connect Wallet'}
                </DialogTitle>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {!isMetaMaskInstalled ? (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                MetaMask is required to use this application.
                            </Typography>
                            <Link 
                                href="https://metamask.io/download/"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ display: 'block', mt: 2 }}
                            >
                                Click here to install MetaMask
                            </Link>
                        </Box>
                    ) : account ? (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Connected Address:
                            </Typography>
                            <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                {account}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                                Network:
                            </Typography>
                            <Typography variant="body1">
                                {getNetworkName(chainId)}
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="body1" gutterBottom>
                                Click the button below to connect your MetaMask wallet.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleConnect}
                                disabled={isConnecting}
                                sx={{ mt: 2 }}
                            >
                                {isConnecting ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Connect MetaMask'
                                )}
                            </Button>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                    {account && (
                        <Button onClick={handleDisconnect} color="error">
                            Disconnect
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default WalletConnect;
