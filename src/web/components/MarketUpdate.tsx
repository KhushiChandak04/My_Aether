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
    Chip,
    IconButton,
    Tooltip as MuiTooltip,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Star,
    StarBorder,
    Refresh,
} from '@mui/icons-material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface CryptoData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    sparkline_in_7d: { price: number[] };
}

const formatPrice = (price: number): string => {
    if (price >= 1000000000) {
        return `$${(price / 1000000000).toFixed(2)}B`;
    }
    if (price >= 1000000) {
        return `$${(price / 1000000).toFixed(2)}M`;
    }
    if (price >= 1000) {
        return `$${(price / 1000).toFixed(2)}K`;
    }
    return `$${price.toFixed(2)}`;
};

const formatPriceChange = (change: number): string => {
    return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
};

const MarketUpdate: React.FC = () => {
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchCryptoData = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h'
            );
            if (!response.ok) {
                throw new Error('Failed to fetch crypto data');
            }
            const data = await response.json();
            setCryptoData(data);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError('Failed to fetch market data. Please try again later.');
            console.error('Error fetching crypto data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const toggleFavorite = (id: string) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Market Update</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </Typography>
                    <IconButton onClick={() => fetchCryptoData()} size="small">
                        <Refresh />
                    </IconButton>
                </Box>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width={30}>#</TableCell>
                            <TableCell>Symbol</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">24h %</TableCell>
                            <TableCell align="right">Market Cap</TableCell>
                            <TableCell align="right">24h Chart</TableCell>
                            <TableCell width={50}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cryptoData.map((crypto) => (
                            <TableRow
                                key={crypto.id}
                                sx={{
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <TableCell>{crypto.market_cap_rank}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <img
                                            src={crypto.image}
                                            alt={crypto.name}
                                            style={{ width: 24, height: 24 }}
                                        />
                                        <Box>
                                            <Typography variant="body2">{crypto.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {crypto.symbol.toUpperCase()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2">
                                        {formatPrice(crypto.current_price)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Chip
                                        icon={crypto.price_change_percentage_24h > 0 ? <TrendingUp /> : <TrendingDown />}
                                        label={formatPriceChange(crypto.price_change_percentage_24h)}
                                        size="small"
                                        color={crypto.price_change_percentage_24h > 0 ? 'success' : 'error'}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2">
                                        {formatPrice(crypto.market_cap)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ width: 120, height: 60 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart 
                                            data={crypto.sparkline_in_7d.price.map((price, index) => ({
                                                time: index,
                                                value: price
                                            }))}
                                            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                                        >
                                            <defs>
                                                <linearGradient id={`gradient-${crypto.id}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop
                                                        offset="5%"
                                                        stopColor={crypto.price_change_percentage_24h > 0 ? '#4CAF50' : '#f44336'}
                                                        stopOpacity={0.8}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor={crypto.price_change_percentage_24h > 0 ? '#4CAF50' : '#f44336'}
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="time" hide={true} />
                                            <YAxis hide={true} domain={['auto', 'auto']} />
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length && payload[0].value != null) {
                                                        return (
                                                            <Box sx={{ 
                                                                bgcolor: 'background.paper',
                                                                p: 1,
                                                                border: 1,
                                                                borderColor: 'divider',
                                                                borderRadius: 1,
                                                            }}>
                                                                <Typography variant="body2">
                                                                    {formatPrice(Number(payload[0].value))}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke={crypto.price_change_percentage_24h > 0 ? '#4CAF50' : '#f44336'}
                                                fillOpacity={1}
                                                fill={`url(#gradient-${crypto.id})`}
                                                isAnimationActive={false}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </TableCell>
                                <TableCell>
                                    <MuiTooltip title={favorites.includes(crypto.id) ? 'Remove from favorites' : 'Add to favorites'}>
                                        <IconButton
                                            size="small"
                                            onClick={() => toggleFavorite(crypto.id)}
                                        >
                                            {favorites.includes(crypto.id) ? (
                                                <Star sx={{ color: 'warning.main' }} />
                                            ) : (
                                                <StarBorder />
                                            )}
                                        </IconButton>
                                    </MuiTooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default MarketUpdate;
