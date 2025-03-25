import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, CircularProgress, Grid, Box, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
const LiquidityPanel = ({ connected }) => {
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error('Failed to add liquidity:', error);
        }
        finally {
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
        }
        catch (error) {
            console.error('Failed to remove liquidity:', error);
        }
        finally {
            setLoading(false);
        }
    };
    if (!connected) {
        return (_jsx(Paper, { sx: { p: 3, mt: 2 }, children: _jsx(Typography, { variant: "body1", color: "textSecondary", children: "Please connect your wallet to manage liquidity" }) }));
    }
    return (_jsxs(Paper, { sx: { p: 3, mt: 2 }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Liquidity Management" }), _jsxs(Box, { sx: { mb: 3 }, children: [_jsx(Typography, { variant: "body1", color: "textSecondary", gutterBottom: true, children: "Current Balance" }), _jsxs(Typography, { variant: "h5", children: [balance, " APT"] })] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Add Liquidity" }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(TextField, { size: "small", type: "number", value: addAmount, onChange: (e) => setAddAmount(e.target.value), placeholder: "Amount in APT", disabled: loading, fullWidth: true }), _jsx(Button, { variant: "contained", color: "primary", onClick: handleAddLiquidity, disabled: loading || !addAmount, startIcon: loading ? _jsx(CircularProgress, { size: 20 }) : _jsx(AddIcon, {}), children: "Add" })] })] }), _jsxs(Grid, { item: true, xs: 12, md: 6, children: [_jsx(Typography, { variant: "subtitle1", gutterBottom: true, children: "Remove Liquidity" }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(TextField, { size: "small", type: "number", value: removeAmount, onChange: (e) => setRemoveAmount(e.target.value), placeholder: "Amount in APT", disabled: loading, fullWidth: true }), _jsx(Button, { variant: "contained", color: "error", onClick: handleRemoveLiquidity, disabled: loading || !removeAmount, startIcon: loading ? _jsx(CircularProgress, { size: 20 }) : _jsx(RemoveIcon, {}), children: "Remove" })] })] })] })] }));
};
export default LiquidityPanel;
