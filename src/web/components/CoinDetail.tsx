import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Grid,
    ButtonGroup,
    Button,
    CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { marketService, HistoricalData, CryptoData } from '../../services/marketService';

interface CoinDetailProps {
    open: boolean;
    onClose: () => void;
    coin: CryptoData;
}

const timeRanges = [
    { label: '24H', days: 1 },
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
];

const CoinDetail: React.FC<CoinDetailProps> = ({ open, onClose, coin }) => {
    const [selectedRange, setSelectedRange] = useState(timeRanges[1]);
    const [historicalData, setHistoricalData] = useState<HistoricalData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistoricalData = async () => {
            setLoading(true);
            const data = await marketService.getHistoricalData(coin.id, selectedRange.days);
            setHistoricalData(data);
            setLoading(false);
        };

        if (open) {
            fetchHistoricalData();
            const interval = setInterval(fetchHistoricalData, 30000); // Update every 30 seconds
            return () => clearInterval(interval);
        }
    }, [coin.id, selectedRange.days, open]);

    const formatData = (data: HistoricalData | null) => {
        if (!data) return [];
        return data.prices.map(([timestamp, price]) => ({
            timestamp,
            price,
            date: new Date(timestamp).toLocaleDateString(),
            time: new Date(timestamp).toLocaleTimeString(),
        }));
    };

    const formatYAxis = (value: number) => {
        if (value >= 1000000000) {
            return `$${(value / 1000000000).toFixed(2)}B`;
        }
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(2)}M`;
        }
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(2)}K`;
        }
        return `$${value.toFixed(2)}`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{ bgcolor: 'background.paper', p: 2, border: 1, borderColor: 'divider' }}>
                    <Typography variant="body2">
                        {new Date(label).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" color="primary">
                        Price: ${payload[0].value.toFixed(2)}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <img 
                            src={coin.image} 
                            alt={coin.name}
                            style={{ width: 32, height: 32 }}
                        />
                        <Typography variant="h6">
                            {coin.name} ({coin.symbol.toUpperCase()})
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Box>
                                <Typography variant="h4">
                                    ${coin.current_price.toLocaleString()}
                                </Typography>
                                <Typography 
                                    variant="body1"
                                    sx={{ 
                                        color: coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main'
                                    }}
                                >
                                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                                    {coin.price_change_percentage_24h.toFixed(2)}%
                                </Typography>
                            </Box>
                            <ButtonGroup>
                                {timeRanges.map((range) => (
                                    <Button
                                        key={range.label}
                                        variant={selectedRange === range ? 'contained' : 'outlined'}
                                        onClick={() => setSelectedRange(range)}
                                    >
                                        {range.label}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sx={{ height: 400 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={formatData(historicalData)}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="timestamp"
                                        tickFormatter={(timestamp) => {
                                            const date = new Date(timestamp);
                                            return selectedRange.days <= 1 
                                                ? date.toLocaleTimeString()
                                                : date.toLocaleDateString();
                                        }}
                                    />
                                    <YAxis 
                                        tickFormatter={formatYAxis}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#3B82F6"
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    Market Cap
                                </Typography>
                                <Typography variant="h6">
                                    ${coin.market_cap.toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    24h Volume
                                </Typography>
                                <Typography variant="h6">
                                    ${coin.total_volume.toLocaleString()}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="body2" color="text.secondary">
                                    Market Cap Rank
                                </Typography>
                                <Typography variant="h6">
                                    #{coin.market_cap_rank}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default CoinDetail;
