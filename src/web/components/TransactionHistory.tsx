import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useTheme,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    AccessTime,
    Info as InfoIcon,
    OpenInNew
} from '@mui/icons-material';

interface Transaction {
    id: string;
    type: 'buy' | 'sell';
    token: string;
    amount: number;
    price: number;
    timestamp: number;
    profit?: number;
    status: 'completed' | 'pending' | 'failed';
    txHash: string;
}

const TransactionHistory: React.FC = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Error fetching transactions';
                setError(errorMessage);
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
        
        // Set up auto-refresh every 30 seconds
        const intervalId = setInterval(fetchTransactions, 30000);
        
        return () => clearInterval(intervalId);
    }, []);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    const getStatusColor = (status: string) => {
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
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <>
            <Paper 
                elevation={3}
                sx={{
                    p: 3,
                    background: theme.palette.background.paper,
                    borderRadius: 2
                }}
            >
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime />
                    Transaction History
                    {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
                </Typography>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Token</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Price (USD)</TableCell>
                                <TableCell align="right">Profit/Loss</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((tx) => (
                                    <TableRow key={tx.id} hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {tx.type === 'buy' ? (
                                                    <TrendingUp color="success" />
                                                ) : (
                                                    <TrendingDown color="error" />
                                                )}
                                                {tx.type.toUpperCase()}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{tx.token}</TableCell>
                                        <TableCell align="right">{tx.amount}</TableCell>
                                        <TableCell align="right">${tx.price.toLocaleString()}</TableCell>
                                        <TableCell align="right">
                                            {tx.profit !== undefined && (
                                                <Typography
                                                    color={tx.profit >= 0 ? 'success.main' : 'error.main'}
                                                >
                                                    ${tx.profit.toLocaleString()}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={tx.status}
                                                color={getStatusColor(tx.status) as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => setSelectedTx(tx)}
                                                color="primary"
                                            >
                                                <InfoIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                href={`https://etherscan.io/tx/${tx.txHash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                color="primary"
                                            >
                                                <OpenInNew />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <TablePagination
                    component="div"
                    count={transactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <Dialog open={!!selectedTx} onClose={() => setSelectedTx(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogContent>
                    {selectedTx && (
                        <Box sx={{ mt: 2 }}>
                            <Typography><strong>Transaction ID:</strong> {selectedTx.id}</Typography>
                            <Typography><strong>Type:</strong> {selectedTx.type.toUpperCase()}</Typography>
                            <Typography><strong>Token:</strong> {selectedTx.token}</Typography>
                            <Typography><strong>Amount:</strong> {selectedTx.amount}</Typography>
                            <Typography><strong>Price:</strong> ${selectedTx.price.toLocaleString()}</Typography>
                            {selectedTx.profit !== undefined && (
                                <Typography>
                                    <strong>Profit/Loss:</strong>{' '}
                                    <span style={{ color: selectedTx.profit >= 0 ? '#2e7d32' : '#d32f2f' }}>
                                        ${selectedTx.profit.toLocaleString()}
                                    </span>
                                </Typography>
                            )}
                            <Typography><strong>Time:</strong> {formatTimestamp(selectedTx.timestamp)}</Typography>
                            <Typography><strong>Status:</strong> {selectedTx.status}</Typography>
                            <Typography><strong>Transaction Hash:</strong> {selectedTx.txHash}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedTx(null)}>Close</Button>
                    {selectedTx && (
                        <Button
                            href={`https://etherscan.io/tx/${selectedTx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="contained"
                        >
                            View on Etherscan
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TransactionHistory;
