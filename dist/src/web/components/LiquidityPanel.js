"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const Add_1 = __importDefault(require("@mui/icons-material/Add"));
const Remove_1 = __importDefault(require("@mui/icons-material/Remove"));
const LiquidityPanel = ({ connected }) => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [balance, setBalance] = (0, react_1.useState)('0');
    const [addAmount, setAddAmount] = (0, react_1.useState)('');
    const [removeAmount, setRemoveAmount] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
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
        return ((0, jsx_runtime_1.jsx)(material_1.Paper, { sx: { p: 3, mt: 2 }, children: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", color: "textSecondary", children: "Please connect your wallet to manage liquidity" }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(material_1.Paper, { sx: { p: 3, mt: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "Liquidity Management" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 3 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", color: "textSecondary", gutterBottom: true, children: "Current Balance" }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h5", children: [balance, " APT"] })] }), (0, jsx_runtime_1.jsx)(material_1.Divider, { sx: { my: 2 } }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 3, children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 12, md: 6, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", gutterBottom: true, children: "Add Liquidity" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { size: "small", type: "number", value: addAmount, onChange: (e) => setAddAmount(e.target.value), placeholder: "Amount in APT", disabled: loading, fullWidth: true }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleAddLiquidity, disabled: loading || !addAmount, startIcon: loading ? (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 20 }) : (0, jsx_runtime_1.jsx)(Add_1.default, {}), children: "Add" })] })] }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 12, md: 6, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", gutterBottom: true, children: "Remove Liquidity" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.TextField, { size: "small", type: "number", value: removeAmount, onChange: (e) => setRemoveAmount(e.target.value), placeholder: "Amount in APT", disabled: loading, fullWidth: true }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "error", onClick: handleRemoveLiquidity, disabled: loading || !removeAmount, startIcon: loading ? (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 20 }) : (0, jsx_runtime_1.jsx)(Remove_1.default, {}), children: "Remove" })] })] })] })] }));
};
exports.default = LiquidityPanel;
