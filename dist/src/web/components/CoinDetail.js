"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const recharts_1 = require("recharts");
const marketService_1 = require("../../services/marketService");
const timeRanges = [
    { label: '24H', days: 1 },
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '90D', days: 90 },
];
const CoinDetail = ({ open, onClose, coin }) => {
    const [selectedRange, setSelectedRange] = (0, react_1.useState)(timeRanges[1]);
    const [historicalData, setHistoricalData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchHistoricalData = async () => {
            setLoading(true);
            const data = await marketService_1.marketService.getHistoricalData(coin.id, selectedRange.days);
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
            return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { bgcolor: 'background.paper', p: 2, border: 1, borderColor: 'divider' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: new Date(label).toLocaleString() }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body1", color: "primary", children: ["Price: $", payload[0].value.toFixed(2)] })] }));
        }
        return null;
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Dialog, { open: open, onClose: onClose, maxWidth: "lg", fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.DialogTitle, { children: (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [(0, jsx_runtime_1.jsx)("img", { src: coin.image, alt: coin.name, style: { width: 32, height: 32 } }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h6", children: [coin.name, " (", coin.symbol.toUpperCase(), ")"] })] }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: onClose, children: (0, jsx_runtime_1.jsx)(icons_material_1.Close, {}) })] }) }), (0, jsx_runtime_1.jsx)(material_1.DialogContent, { children: (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 3, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h4", children: ["$", coin.current_price.toLocaleString()] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body1", sx: {
                                                    color: coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main'
                                                }, children: [coin.price_change_percentage_24h >= 0 ? '+' : '', coin.price_change_percentage_24h.toFixed(2), "%"] })] }), (0, jsx_runtime_1.jsx)(material_1.ButtonGroup, { children: timeRanges.map((range) => ((0, jsx_runtime_1.jsx)(material_1.Button, { variant: selectedRange === range ? 'contained' : 'outlined', onClick: () => setSelectedRange(range), children: range.label }, range.label))) })] }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, sx: { height: 400 }, children: loading ? ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }, children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) })) : ((0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.AreaChart, { data: formatData(historicalData), children: [(0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: "colorPrice", x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "5%", stopColor: "#3B82F6", stopOpacity: 0.8 }), (0, jsx_runtime_1.jsx)("stop", { offset: "95%", stopColor: "#3B82F6", stopOpacity: 0 })] }) }), (0, jsx_runtime_1.jsx)(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }), (0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "timestamp", tickFormatter: (timestamp) => {
                                                const date = new Date(timestamp);
                                                return selectedRange.days <= 1
                                                    ? date.toLocaleTimeString()
                                                    : date.toLocaleDateString();
                                            } }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, { tickFormatter: formatYAxis, domain: ['auto', 'auto'] }), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, { content: (0, jsx_runtime_1.jsx)(CustomTooltip, {}) }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "price", stroke: "#3B82F6", fillOpacity: 1, fill: "url(#colorPrice)" })] }) })) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 2, children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 12, sm: 6, md: 3, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: "Market Cap" }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h6", children: ["$", coin.market_cap.toLocaleString()] })] }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 12, sm: 6, md: 3, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: "24h Volume" }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h6", children: ["$", coin.total_volume.toLocaleString()] })] }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 12, sm: 6, md: 3, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: "Market Cap Rank" }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h6", children: ["#", coin.market_cap_rank] })] })] }) })] }) })] }));
};
exports.default = CoinDetail;
