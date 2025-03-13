import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    ButtonGroup,
    Button,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { marketService, CryptoData } from '../../services/marketService';

const CryptoList: React.FC = () => {
    const [view, setView] = useState<'all' | 'gainers' | 'losers'>('all');
    const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await marketService.getTopCryptos(50);
                setCryptoData(data);
            } catch (error) {
                console.error('Error fetching crypto data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const filteredData = React.useMemo(() => {
        let filtered = [...cryptoData];
        switch (view) {
            case 'gainers':
                return filtered
                    .filter(coin => coin.price_change_percentage_24h > 0)
                    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                    .slice(0, 5);
            case 'losers':
                return filtered
                    .filter(coin => coin.price_change_percentage_24h < 0)
                    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                    .slice(0, 5);
            default:
                return filtered
                    .sort((a, b) => b.market_cap - a.market_cap)
                    .slice(0, 5);
        }
    }, [cryptoData, view]);

    if (loading) {
        return (
            <Paper sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Crypto List</Typography>
                <ButtonGroup size="small">
                    <Button
                        variant={view === 'all' ? 'contained' : 'outlined'}
                        onClick={() => setView('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={view === 'gainers' ? 'contained' : 'outlined'}
                        onClick={() => setView('gainers')}
                    >
                        Gainers
                    </Button>
                    <Button
                        variant={view === 'losers' ? 'contained' : 'outlined'}
                        onClick={() => setView('losers')}
                    >
                        Losers
                    </Button>
                </ButtonGroup>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredData.map((coin) => (
                    <Card key={coin.id}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <img 
                                        src={coin.image} 
                                        alt={coin.name}
                                        style={{ width: 32, height: 32 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1">
                                            {coin.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {coin.symbol.toUpperCase()}
                                        </Typography>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="subtitle1">
                                        ${coin.current_price.toLocaleString()}
                                    </Typography>
                                    <Typography 
                                        variant="body2"
                                        sx={{ 
                                            color: coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}
                                    >
                                        {coin.price_change_percentage_24h >= 0 ? (
                                            <>
                                                <TrendingUpIcon fontSize="small" />
                                                +{coin.price_change_percentage_24h.toFixed(2)}%
                                            </>
                                        ) : (
                                            <>
                                                <TrendingDownIcon fontSize="small" />
                                                {coin.price_change_percentage_24h.toFixed(2)}%
                                            </>
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Market Cap: ${coin.market_cap.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    24h Volume: ${coin.total_volume.toLocaleString()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Paper>
    );
};

export default CryptoList;
