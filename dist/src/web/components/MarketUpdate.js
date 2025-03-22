"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_material_1 = require("@mui/icons-material");
const material_1 = require("@mui/material");
const react_1 = require("react");
const recharts_1 = require("recharts");
const formatPrice = (price) => {
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
const formatPriceChange = (change) => {
    return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
};
const MarketUpdate = () => {
    const [cryptoData, setCryptoData] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [favorites, setFavorites] = (0, react_1.useState)([]);
    const [lastUpdated, setLastUpdated] = (0, react_1.useState)(new Date());
    const [retryCount, setRetryCount] = (0, react_1.useState)(0);
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds
    const fetchCryptoData = (0, react_1.useCallback)(async (isRetry = false) => {
        try {
            if (!isRetry) {
                setLoading(true);
            }
            const response = await fetch("http://localhost:4000/api/market/crypto", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to fetch crypto data: ${response.status}`);
            }
            const data = await response.json();
            setCryptoData(data);
            setLastUpdated(new Date());
            setError(null);
            setRetryCount(0);
        }
        catch (err) {
            console.error("Error fetching crypto data:", err);
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => fetchCryptoData(true), RETRY_DELAY);
                setError(`Retrying to fetch market data... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
            }
            else {
                setError("Failed to fetch market data. Please try again later.");
            }
        }
        finally {
            setLoading(false);
        }
    }, [retryCount]);
    (0, react_1.useEffect)(() => {
        fetchCryptoData();
        const interval = setInterval(() => fetchCryptoData(), 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, [fetchCryptoData]);
    const toggleFavorite = (id) => {
        setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
    };
    const handleRefresh = () => {
        setRetryCount(0);
        fetchCryptoData();
    };
    if (loading && !cryptoData.length) {
        return ((0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: "flex", justifyContent: "center", p: 3 }, children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) }));
    }
    return ((0, jsx_runtime_1.jsxs)(material_1.Paper, { sx: { p: 3 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Market Update" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", alignItems: "center", gap: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", color: "text.secondary", children: ["Last updated: ", lastUpdated.toLocaleTimeString()] }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { onClick: handleRefresh, size: "small", disabled: loading, children: (0, jsx_runtime_1.jsx)(icons_material_1.Refresh, {}) })] })] }), error && ((0, jsx_runtime_1.jsx)(material_1.Alert, { severity: retryCount < MAX_RETRIES ? "info" : "error", sx: { mb: 2 }, children: error })), (0, jsx_runtime_1.jsx)(material_1.TableContainer, { children: (0, jsx_runtime_1.jsxs)(material_1.Table, { children: [(0, jsx_runtime_1.jsx)(material_1.TableHead, { children: (0, jsx_runtime_1.jsxs)(material_1.TableRow, { children: [(0, jsx_runtime_1.jsx)(material_1.TableCell, { width: 30, children: "#" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: "Symbol" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: "Price" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: "24h %" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: "Market Cap" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: "24h Chart" }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { width: 50 })] }) }), (0, jsx_runtime_1.jsx)(material_1.TableBody, { children: cryptoData.map((crypto) => ((0, jsx_runtime_1.jsxs)(material_1.TableRow, { sx: {
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
                                }, children: [(0, jsx_runtime_1.jsx)(material_1.TableCell, { children: crypto.market_cap_rank }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [(0, jsx_runtime_1.jsx)("img", { src: crypto.image, alt: crypto.name, style: { width: 24, height: 24 } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: crypto.name }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", color: "text.secondary", children: crypto.symbol.toUpperCase() })] })] }) }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: formatPrice(crypto.current_price) }) }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: (0, jsx_runtime_1.jsx)(material_1.Chip, { icon: crypto.price_change_percentage_24h > 0 ? ((0, jsx_runtime_1.jsx)(icons_material_1.TrendingUp, {})) : ((0, jsx_runtime_1.jsx)(icons_material_1.TrendingDown, {})), label: formatPriceChange(crypto.price_change_percentage_24h), size: "small", color: crypto.price_change_percentage_24h > 0
                                                ? "success"
                                                : "error" }) }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: formatPrice(crypto.market_cap) }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", sx: { width: 200 }, children: crypto.sparkline_in_7d && ((0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: 50, children: (0, jsx_runtime_1.jsxs)(recharts_1.AreaChart, { data: crypto.sparkline_in_7d.price.map((price, i) => ({ price, i })), children: [(0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("linearGradient", { id: `gradient-${crypto.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { offset: "5%", stopColor: crypto.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336", stopOpacity: 0.8 }), (0, jsx_runtime_1.jsx)("stop", { offset: "95%", stopColor: crypto.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336", stopOpacity: 0 })] }) }), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "price", stroke: crypto.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336", fill: `url(#gradient-${crypto.id})` })] }) })) }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: (0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "small", onClick: () => toggleFavorite(crypto.id), children: favorites.includes(crypto.id) ? ((0, jsx_runtime_1.jsx)(icons_material_1.Star, { sx: { color: "warning.main" } })) : ((0, jsx_runtime_1.jsx)(icons_material_1.StarBorder, {})) }) })] }, crypto.id))) })] }) })] }));
};
exports.default = MarketUpdate;
