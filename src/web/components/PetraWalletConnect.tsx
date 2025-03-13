import { AccountBalanceWallet, Warning } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Typography,
} from "@mui/material";
import React from "react";
import { usePetra } from "../providers/PetraProvider";

const getNetworkName = (network: string | null): string => {
  if (!network) return "Unknown Network";

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

const PetraWalletConnect: React.FC = () => {
  const {
    account,
    connect,
    disconnect,
    isConnecting,
    error,
    isPetraInstalled,
    network,
  } = usePetra();
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
        ) : !isPetraInstalled ? (
          "Install Petra"
        ) : (
          "Connect Wallet"
        )}
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {account ? "Wallet Information" : "Connect Wallet"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {!isPetraInstalled ? (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body1" gutterBottom>
                Petra wallet is required to use this application.
              </Typography>
              <Link
                href="https://petra.app/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "block", mt: 2 }}
              >
                Click here to install Petra wallet
              </Link>
            </Box>
          ) : account ? (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Connected Address:
              </Typography>
              <Typography variant="body1" sx={{ wordBreak: "break-all" }}>
                {account}
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Network:
              </Typography>
              <Typography variant="body1">{getNetworkName(network)}</Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="body1" gutterBottom>
                Click the button below to connect your Petra wallet.
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
                  "Connect Petra"
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

export default PetraWalletConnect;
