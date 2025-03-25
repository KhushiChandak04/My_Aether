import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, useTheme, CircularProgress, Alert } from '@mui/material';
import { TrendingUp, TrendingDown, AccessTime, Info as InfoIcon, OpenInNew } from '@mui/icons-material';
const TransactionHistory = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedTx, setSelectedTx] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/trades/history');
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.error || 'Failed to fetch transactions');
                }
                setTransactions(data.data || []);
                setError(null);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error fetching transactions';
                setError(errorMessage);
                console.error('Error fetching transactions:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchTransactions();
        // Set up auto-refresh every 30 seconds
        const intervalId = setInterval(fetchTransactions, 30000);
        return () => clearInterval(intervalId);
    }, []);
    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const formatTimestamp = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'failed':
                return 'error';
            default:
                return 'default';
        }
    };
    if (loading && transactions.length === 0) {
        return (_jsx(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", children: _jsx(CircularProgress, {}) }));
    }
    if (error) {
        return (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: error }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs(Paper, { elevation: 3, sx: {
                    p: 3,
                    background: theme.palette.background.paper,
                    borderRadius: 2
                }, children: [_jsxs(Typography, { variant: "h6", gutterBottom: true, sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(AccessTime, {}), "Transaction History", loading && _jsx(CircularProgress, { size: 20, sx: { ml: 2 } })] }), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Type" }), _jsx(TableCell, { children: "Token" }), _jsx(TableCell, { align: "right", children: "Amount" }), _jsx(TableCell, { align: "right", children: "Price (USD)" }), _jsx(TableCell, { align: "right", children: "Profit/Loss" }), _jsx(TableCell, { children: "Time" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { align: "center", children: "Actions" })] }) }), _jsx(TableBody, { children: transactions
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((tx) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [tx.type === 'buy' ? (_jsx(TrendingUp, { color: "success" })) : (_jsx(TrendingDown, { color: "error" })), tx.type.toUpperCase()] }) }), _jsx(TableCell, { children: tx.token }), _jsx(TableCell, { align: "right", children: tx.amount }), _jsxs(TableCell, { align: "right", children: ["$", tx.price.toLocaleString()] }), _jsx(TableCell, { align: "right", children: tx.profit !== undefined && (_jsxs(Typography, { color: tx.profit >= 0 ? 'success.main' : 'error.main', children: ["$", tx.profit.toLocaleString()] })) }), _jsx(TableCell, { children: formatTimestamp(tx.timestamp) }), _jsx(TableCell, { children: _jsx(Chip, { label: tx.status, color: getStatusColor(tx.status), size: "small" }) }), _jsxs(TableCell, { align: "center", children: [_jsx(IconButton, { size: "small", onClick: () => setSelectedTx(tx), color: "primary", children: _jsx(InfoIcon, {}) }), _jsx(IconButton, { size: "small", href: `https://etherscan.io/tx/${tx.txHash}`, target: "_blank", rel: "noopener noreferrer", color: "primary", children: _jsx(OpenInNew, {}) })] })] }, tx.id))) })] }) }), _jsx(TablePagination, { component: "div", count: transactions.length, rowsPerPage: rowsPerPage, page: page, onPageChange: handleChangePage, onRowsPerPageChange: handleChangeRowsPerPage })] }), _jsxs(Dialog, { open: !!selectedTx, onClose: () => setSelectedTx(null), maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "Transaction Details" }), _jsx(DialogContent, { children: selectedTx && (_jsxs(Box, { sx: { mt: 2 }, children: [_jsxs(Typography, { children: [_jsx("strong", { children: "Transaction ID:" }), " ", selectedTx.id] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Type:" }), " ", selectedTx.type.toUpperCase()] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Token:" }), " ", selectedTx.token] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Amount:" }), " ", selectedTx.amount] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Price:" }), " $", selectedTx.price.toLocaleString()] }), selectedTx.profit !== undefined && (_jsxs(Typography, { children: [_jsx("strong", { children: "Profit/Loss:" }), ' ', _jsxs("span", { style: { color: selectedTx.profit >= 0 ? '#2e7d32' : '#d32f2f' }, children: ["$", selectedTx.profit.toLocaleString()] })] })), _jsxs(Typography, { children: [_jsx("strong", { children: "Time:" }), " ", formatTimestamp(selectedTx.timestamp)] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Status:" }), " ", selectedTx.status] }), _jsxs(Typography, { children: [_jsx("strong", { children: "Transaction Hash:" }), " ", selectedTx.txHash] })] })) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setSelectedTx(null), children: "Close" }), selectedTx && (_jsx(Button, { href: `https://etherscan.io/tx/${selectedTx.txHash}`, target: "_blank", rel: "noopener noreferrer", variant: "contained", children: "View on Etherscan" }))] })] })] }));
};
export default TransactionHistory;
