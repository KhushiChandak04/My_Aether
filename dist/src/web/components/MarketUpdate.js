import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Refresh, Star, StarBorder, TrendingDown, TrendingUp, } from "@mui/icons-material";
import { Alert, Box, Chip, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { Area, AreaChart, ResponsiveContainer, } from "recharts";
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
    const [cryptoData, setCryptoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds
    const fetchCryptoData = useCallback(async (isRetry = false) => {
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
    useEffect(() => {
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
        return (_jsx(Box, { sx: { display: "flex", justifyContent: "center", p: 3 }, children: _jsx(CircularProgress, {}) }));
    }
    return (_jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Box, { sx: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }, children: [_jsx(Typography, { variant: "h6", children: "Market Update" }), _jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 2 }, children: [_jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["Last updated: ", lastUpdated.toLocaleTimeString()] }), _jsx(IconButton, { onClick: handleRefresh, size: "small", disabled: loading, children: _jsx(Refresh, {}) })] })] }), error && (_jsx(Alert, { severity: retryCount < MAX_RETRIES ? "info" : "error", sx: { mb: 2 }, children: error })), _jsx(TableContainer, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { width: 30, children: "#" }), _jsx(TableCell, { children: "Symbol" }), _jsx(TableCell, { align: "right", children: "Price" }), _jsx(TableCell, { align: "right", children: "24h %" }), _jsx(TableCell, { align: "right", children: "Market Cap" }), _jsx(TableCell, { align: "right", children: "24h Chart" }), _jsx(TableCell, { width: 50 })] }) }), _jsx(TableBody, { children: cryptoData.map((crypto) => (_jsxs(TableRow, { sx: {
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
                                }, children: [_jsx(TableCell, { children: crypto.market_cap_rank }), _jsx(TableCell, { children: _jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [_jsx("img", { src: crypto.image, alt: crypto.name, style: { width: 24, height: 24 } }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", children: crypto.name }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: crypto.symbol.toUpperCase() })] })] }) }), _jsx(TableCell, { align: "right", children: _jsx(Typography, { variant: "body2", children: formatPrice(crypto.current_price) }) }), _jsx(TableCell, { align: "right", children: _jsx(Chip, { icon: crypto.price_change_percentage_24h > 0 ? (_jsx(TrendingUp, {})) : (_jsx(TrendingDown, {})), label: formatPriceChange(crypto.price_change_percentage_24h), size: "small", color: crypto.price_change_percentage_24h > 0
                                                ? "success"
                                                : "error" }) }), _jsx(TableCell, { align: "right", children: formatPrice(crypto.market_cap) }), _jsx(TableCell, { align: "right", sx: { width: 200 }, children: crypto.sparkline_in_7d && (_jsx(ResponsiveContainer, { width: "100%", height: 50, children: _jsxs(AreaChart, { data: crypto.sparkline_in_7d.price.map((price, i) => ({ price, i })), children: [_jsx("defs", { children: _jsxs("linearGradient", { id: `gradient-${crypto.id}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: crypto.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: crypto.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336", stopOpacity: 0 })] }) }), _jsx(Area, { type: "monotone", dataKey: "price", stroke: crypto.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336", fill: `url(#gradient-${crypto.id})` })] }) })) }), _jsx(TableCell, { children: _jsx(IconButton, { size: "small", onClick: () => toggleFavorite(crypto.id), children: favorites.includes(crypto.id) ? (_jsx(Star, { sx: { color: "warning.main" } })) : (_jsx(StarBorder, {})) }) })] }, crypto.id))) })] }) })] }));
};
export default MarketUpdate;
