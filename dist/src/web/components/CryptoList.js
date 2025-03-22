"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const TrendingUp_1 = __importDefault(require("@mui/icons-material/TrendingUp"));
const TrendingDown_1 = __importDefault(require("@mui/icons-material/TrendingDown"));
const marketService_1 = require("../../services/marketService");
const CryptoList = () => {
    const [view, setView] = (0, react_1.useState)('all');
    const [cryptoData, setCryptoData] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await marketService_1.marketService.getTopCryptos(50);
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
    const filteredData = react_1.default.useMemo(() => {
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
        return ((0, jsx_runtime_1.jsx)(material_1.Paper, { sx: { p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }, children: (0, jsx_runtime_1.jsx)(material_1.CircularProgress, {}) }));
    }
    return ((0, jsx_runtime_1.jsxs)(material_1.Paper, { sx: { p: 3 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Crypto List" }), (0, jsx_runtime_1.jsxs)(material_1.ButtonGroup, { size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: view === 'all' ? 'contained' : 'outlined', onClick: () => setView('all'), children: "All" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: view === 'gainers' ? 'contained' : 'outlined', onClick: () => setView('gainers'), children: "Gainers" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: view === 'losers' ? 'contained' : 'outlined', onClick: () => setView('losers'), children: "Losers" })] })] }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: 'flex', flexDirection: 'column', gap: 2 }, children: filteredData.map((coin) => ((0, jsx_runtime_1.jsx)(material_1.Card, { children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 }, children: [(0, jsx_runtime_1.jsx)("img", { src: coin.image, alt: coin.name, style: { width: 32, height: 32 } }), (0, jsx_runtime_1.jsxs)(material_1.Box, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", children: coin.name }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: coin.symbol.toUpperCase() })] })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { textAlign: 'right' }, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "subtitle1", children: ["$", coin.current_price.toLocaleString()] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", sx: {
                                                    color: coin.price_change_percentage_24h >= 0 ? 'success.main' : 'error.main',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }, children: coin.price_change_percentage_24h >= 0 ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(TrendingUp_1.default, { fontSize: "small" }), "+", coin.price_change_percentage_24h.toFixed(2), "%"] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(TrendingDown_1.default, { fontSize: "small" }), coin.price_change_percentage_24h.toFixed(2), "%"] })) })] })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mt: 2 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", color: "text.secondary", children: ["Market Cap: $", coin.market_cap.toLocaleString()] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", color: "text.secondary", children: ["24h Volume: $", coin.total_volume.toLocaleString()] })] })] }) }, coin.id))) })] }));
};
exports.default = CryptoList;
