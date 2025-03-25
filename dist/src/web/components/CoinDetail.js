import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography, IconButton, Grid, ButtonGroup, Button, CircularProgress, } from '@mui/material';
import { Close } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from 'recharts';
import { marketService } from '../../services/marketService';
const timeRanges = [
    { label: '24H', days: 1 },
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
];
const CoinDetail = ({ open, onClose, coin }) => {
    const [selectedRange, setSelectedRange] = useState(timeRanges[1]);
    const [historicalData, setHistoricalData] = useState(null);
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
    const formatData = (data) => {
        if (!data)
            return [];
        return data.prices.map(([timestamp, price]) => ({
            timestamp,
            price,
            date: new Date(timestamp).toLocaleDateString(),
            time: new Date(timestamp).toLocaleTimeString(),
        }));
    };
    const formatYAxis = (value) => {
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
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (_jsxs(Box, { sx: { bgcolor: 'background.paper', p: 2, border: 1, borderColor: 'divider' }, children: [_jsx(Typography, { variant: "body2", children: new Date(label).toLocaleString() }), _jsxs(Typography, { variant: "body1", color: "primary", children: ["Price: $", payload[0].value.toFixed(2)] })] }));
        }
        return null;
    };
    return (_jsxs(Dialog, { open: open, onClose: onClose, maxWidth: "lg", fullWidth: true, children: [_jsx(DialogTitle, { children: _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [_jsx("img", { src: coin.image, alt: coin.name, style: { width: 32, height: 32 } }), _jsxs(Typography, { variant: "h6", children: [coin.name, " (", coin.symbol.toUpperCase(), ")"] })] }), _jsx(IconButton, { onClick: onClose, children: _jsx(Close, {}) })] }) }), _jsx(DialogContent, { children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsxs(Box, { children: [_jsxs(Typography, { variant: "h4", children: ["$", coin.current_price.toLocaleString()] }), _jsxs(Typography, { variant: "body1", sx: {
                                                    color: coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main'
                                                }, children: [coin.price_change_percentage_24h >= 0 ? '+' : '', coin.price_change_percentage_24h.toFixed(2), "%"] })] }), _jsx(ButtonGroup, { children: timeRanges.map((range) => (_jsx(Button, { variant: selectedRange === range ? 'contained' : 'outlined', onClick: () => setSelectedRange(range), children: range.label }, range.label))) })] }) }), _jsx(Grid, { item: true, xs: 12, sx: { height: 400 }, children: loading ? (_jsx(Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }, children: _jsx(CircularProgress, {}) })) : (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: formatData(historicalData), children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "colorPrice", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "timestamp", tickFormatter: (timestamp) => {
                                                const date = new Date(timestamp);
                                                return selectedRange.days <= 1
                                                    ? date.toLocaleTimeString()
                                                    : date.toLocaleDateString();
                                            } }), _jsx(YAxis, { tickFormatter: formatYAxis, domain: ['auto', 'auto'] }), _jsx(Tooltip, { content: _jsx(CustomTooltip, {}) }), _jsx(Area, { type: "monotone", dataKey: "price", stroke: "#3B82F6", fillOpacity: 1, fill: "url(#colorPrice)" })] }) })) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsxs(Grid, { item: true, xs: 12, sm: 6, md: 3, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Market Cap" }), _jsxs(Typography, { variant: "h6", children: ["$", coin.market_cap.toLocaleString()] })] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, md: 3, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "24h Volume" }), _jsxs(Typography, { variant: "h6", children: ["$", coin.total_volume.toLocaleString()] })] }), _jsxs(Grid, { item: true, xs: 12, sm: 6, md: 3, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Market Cap Rank" }), _jsxs(Typography, { variant: "h6", children: ["#", coin.market_cap_rank] })] })] }) })] }) })] }));
};
export default CoinDetail;
