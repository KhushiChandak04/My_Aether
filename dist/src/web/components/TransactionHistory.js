"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const TransactionHistory = () => {
    const [page, setPage] = (0, react_1.useState)(0);
    const [rowsPerPage, setRowsPerPage] = (0, react_1.useState)(10);
    const [selectedTx, setSelectedTx] = (0, react_1.useState)(null);
    const [transactions, setTransactions] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const theme = (0, material_1.useTheme)();
    (0, react_1.useEffect)(() => {
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
        return ((0, jsx_runtime_1.jsx)(material_1.Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px", children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) }));
    }
    if (error) {
        return ((0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", sx: { mb: 2 }, children: error }));
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(material_1.Paper, { elevation: 3, sx: {
                    p: 3,
                    background: theme.palette.background.paper,
                    borderRadius: 2
                }, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h6", gutterBottom: true, sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(icons_material_1.AccessTime, {}), "Transaction History", loading && (0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 20, sx: { ml: 2 } })] }), (0, jsx_runtime_1.jsx)(material_1.TableContainer, { children: (0, jsx_runtime_1.jsxs)(material_1.Table, { children: [(0, jsx_runtime_1.jsx)(material_1.TableHead, { children: (0, jsx_runtime_1.jsxs)(material_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(material_1.TableCell, { children: "Type" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: "Token" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: "Amount" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: "Price (USD)" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: "Profit/Loss" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: "Time" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: "Status" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "center", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)(material_1.TableBody, { children: transactions
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((tx) => ((0, jsx_runtime_1.jsxs)(material_1.TableRow, { hover: true, children: [(0, jsx_runtime_1.jsx)(material_1.TableCell, { children: (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [tx.type === 'buy' ? ((0, jsx_runtime_1.jsx)(icons_material_1.TrendingUp, { color: "success" })) : ((0, jsx_runtime_1.jsx)(icons_material_1.TrendingDown, { color: "error" })), tx.type.toUpperCase()] }) }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: tx.token }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: tx.amount }), (0, jsx_runtime_1.jsxs)(material_1.TableCell, { align: "right", children: ["$", tx.price.toLocaleString()] }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: tx.profit !== undefined && ((0, jsx_runtime_1.jsxs)(material_1.Typography, { color: tx.profit >= 0 ? 'success.main' : 'error.main', children: ["$", tx.profit.toLocaleString()] })) }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: formatTimestamp(tx.timestamp) }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: (0, jsx_runtime_1.jsx)(material_1.Chip, { label: tx.status, color: getStatusColor(tx.status), size: "small" }) }), (0, jsx_runtime_1.jsxs)(material_1.TableCell, { align: "center", children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "small", onClick: () => setSelectedTx(tx), color: "primary", children: (0, jsx_runtime_1.jsx)(icons_material_1.Info, {}) }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "small", href: `https://etherscan.io/tx/${tx.txHash}`, target: "_blank", rel: "noopener noreferrer", color: "primary", children: (0, jsx_runtime_1.jsx)(icons_material_1.OpenInNew, {}) })] })] }, tx.id))) })] }) }), (0, jsx_runtime_1.jsx)(material_1.TablePagination, { component: "div", count: transactions.length, rowsPerPage: rowsPerPage, page: page, onPageChange: handleChangePage, onRowsPerPageChange: handleChangeRowsPerPage })] }), (0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: !!selectedTx, onClose: () => setSelectedTx(null), maxWidth: "sm", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: "Transaction Details" }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: selectedTx && ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mt: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Transaction ID:" }), " ", selectedTx.id] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Type:" }), " ", selectedTx.type.toUpperCase()] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Token:" }), " ", selectedTx.token] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Amount:" }), " ", selectedTx.amount] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Price:" }), " $", selectedTx.price.toLocaleString()] }), selectedTx.profit !== undefined && ((0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Profit/Loss:" }), ' ', (0, jsx_runtime_1.jsxs)("span", { style: { color: selectedTx.profit >= 0 ? '#2e7d32' : '#d32f2f' }, children: ["$", selectedTx.profit.toLocaleString()] })] })), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Time:" }), " ", formatTimestamp(selectedTx.timestamp)] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Status:" }), " ", selectedTx.status] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Transaction Hash:" }), " ", selectedTx.txHash] })] })) }), (0, jsx_runtime_1.jsxs)(material_1.DialogActions, { children: [(0, jsx_runtime_1.jsx)(material_1.Button, { onClick: () => setSelectedTx(null), children: "Close" }), selectedTx && ((0, jsx_runtime_1.jsx)(material_1.Button, { href: `https://etherscan.io/tx/${selectedTx.txHash}`, target: "_blank", rel: "noopener noreferrer", variant: "contained", children: "View on Etherscan" }))] })] })] }));
};
exports.default = TransactionHistory;
