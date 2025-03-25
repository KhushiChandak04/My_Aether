import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, ButtonGroup, Button, Card, CardContent, CircularProgress, } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { marketService } from '../../services/marketService';
const CryptoList = () => {
    const [view, setView] = useState('all');
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await marketService.getTopCryptos(50);
                setCryptoData(data);
            }
            catch (error) {
                console.error('Error fetching crypto data:', error);
            }
            finally {
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
        return (_jsx(Paper, { sx: { p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [_jsx(Typography, { variant: "h6", children: "Crypto List" }), _jsxs(ButtonGroup, { size: "small", children: [_jsx(Button, { variant: view === 'all' ? 'contained' : 'outlined', onClick: () => setView('all'), children: "All" }), _jsx(Button, { variant: view === 'gainers' ? 'contained' : 'outlined', onClick: () => setView('gainers'), children: "Gainers" }), _jsx(Button, { variant: view === 'losers' ? 'contained' : 'outlined', onClick: () => setView('losers'), children: "Losers" })] })] }), _jsx(Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: filteredData.map((coin) => (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx("img", { src: coin.image, alt: coin.name, style: { width: 32, height: 32 } }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", children: coin.name }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: coin.symbol.toUpperCase() })] })] }), _jsxs(Box, { sx: { textAlign: 'right' }, children: [_jsxs(Typography, { variant: "subtitle1", children: ["$", coin.current_price.toLocaleString()] }), _jsx(Typography, { variant: "body2", sx: {
                                                    color: coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }, children: coin.price_change_percentage_24h >= 0 ? (_jsxs(_Fragment, { children: [_jsx(TrendingUpIcon, { fontSize: "small" }), "+", coin.price_change_percentage_24h.toFixed(2), "%"] })) : (_jsxs(_Fragment, { children: [_jsx(TrendingDownIcon, { fontSize: "small" }), coin.price_change_percentage_24h.toFixed(2), "%"] })) })] })] }), _jsxs(Box, { sx: { mt: 2 }, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Market Cap: $", coin.market_cap.toLocaleString()] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["24h Volume: $", coin.total_volume.toLocaleString()] })] })] }) }, coin.id))) })] }));
};
export default CryptoList;
