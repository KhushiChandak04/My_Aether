import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Grid,
    Box,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface LiquidityPanelProps {
    connected: boolean;
}

const LiquidityPanel: React.FC<LiquidityPanelProps> = ({ connected }) => {
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState('0');
    const [addAmount, setAddAmount] = useState('');
    const [removeAmount, setRemoveAmount] = useState('');

    useEffect(() => {
        if (connected) {
            fetchBalance();
        }
    }, [connected]);

    const fetchBalance = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/liquidity/balance');
            const data = await response.json();
            setBalance(data.balance);
        } catch (error) {
            console.error('Failed to fetch balance:', error);
        }
    };

    const handleAddLiquidity = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/liquidity/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: addAmount })
            });
            const data = await response.json();
            if (data.success) {
                await fetchBalance();
                setAddAmount('');
            }
        } catch (error) {
            console.error('Failed to add liquidity:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveLiquidity = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/liquidity/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: removeAmount })
            });
            const data = await response.json();
            if (data.success) {
                await fetchBalance();
                setRemoveAmount('');
            }
        } catch (error) {
            console.error('Failed to remove liquidity:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!connected) {
        return (
            <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="body1" color="textSecondary">
                    Please connect your wallet to manage liquidity
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Liquidity Management
            </Typography>
            
            <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Current Balance
                </Typography>
                <Typography variant="h5">
                    {balance} APT
                </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                        Add Liquidity
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            size="small"
                            type="number"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            placeholder="Amount in APT"
                            disabled={loading}
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddLiquidity}
                            disabled={loading || !addAmount}
                            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
                        >
                            Add
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                        Remove Liquidity
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            size="small"
                            type="number"
                            value={removeAmount}
                            onChange={(e) => setRemoveAmount(e.target.value)}
                            placeholder="Amount in APT"
                            disabled={loading}
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleRemoveLiquidity}
                            disabled={loading || !removeAmount}
                            startIcon={loading ? <CircularProgress size={20} /> : <RemoveIcon />}
                        >
                            Remove
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default LiquidityPanel;
