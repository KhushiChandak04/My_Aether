"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_material_1 = require("@mui/icons-material");
const material_1 = require("@mui/material");
const react_1 = require("react");
const recharts_1 = require("recharts");
const tradingBotService_1 = require("../../services/tradingBotService");
const PetraProvider_1 = require("../providers/PetraProvider");
const AutoTrading = () => {
    const { account } = (0, PetraProvider_1.usePetra)();
    const theme = (0, material_1.useTheme)();
    const [selectedStrategy, setSelectedStrategy] = (0, react_1.useState)("");
    const [isRunning, setIsRunning] = (0, react_1.useState)(false);
    const [investmentAmount, setInvestmentAmount] = (0, react_1.useState)("");
    const [stopLoss, setStopLoss] = (0, react_1.useState)("");
    const [takeProfit, setTakeProfit] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [showAdvanced, setShowAdvanced] = (0, react_1.useState)(false);
    const [performanceData, setPerformanceData] = (0, react_1.useState)([]);
    const [stats, setStats] = (0, react_1.useState)({
        totalProfit: 0,
        totalTrades: 0,
        winRate: 0,
        activeTime: 0,
        lastPrice: 0,
        currentPosition: null,
        lastTradeTime: null,
    });
    (0, react_1.useEffect)(() => {
        if (account) {
            const loadStrategyDetails = async () => {
                try {
                    const strategyDetails = await tradingBotService_1.tradingBotService.aptosService.getStrategyDetails(account, Date.now());
                    if (strategyDetails) {
                        const params = JSON.parse(strategyDetails[1]);
                        setSelectedStrategy(params.strategy_id);
                        setInvestmentAmount(params.investment_amount.toString());
                        setStopLoss(params.stop_loss?.toString() || "");
                        setTakeProfit(params.take_profit?.toString() || "");
                        setIsRunning(true);
                    }
                }
                catch (error) {
                    console.error("Failed to load strategy:", error);
                }
            };
            loadStrategyDetails();
        }
    }, [account]);
    (0, react_1.useEffect)(() => {
        if (account && isRunning) {
            const interval = setInterval(() => {
                const currentStats = tradingBotService_1.tradingBotService.getStats(account);
                if (currentStats) {
                    setStats(currentStats);
                    setPerformanceData((prev) => [
                        ...prev,
                        {
                            time: new Date().toLocaleTimeString(),
                            profit: currentStats.totalProfit,
                        },
                    ].slice(-20));
                }
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [account, isRunning]);
    const handleStartTrading = async () => {
        if (!account) {
            setError("Please connect your Petra wallet first");
            return;
        }
        if (!selectedStrategy) {
            setError("Please select a trading strategy");
            return;
        }
        const strategy = tradingBotService_1.tradingBotService.strategies.find((s) => s.id === selectedStrategy);
        if (!strategy) {
            setError("Invalid strategy selected");
            return;
        }
        const amount = parseFloat(investmentAmount);
        if (!amount ||
            amount < strategy.minInvestment ||
            amount > strategy.maxInvestment) {
            setError(`Investment amount must be between $${strategy.minInvestment} and $${strategy.maxInvestment}`);
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await tradingBotService_1.tradingBotService.startBot({
                strategy: selectedStrategy,
                investmentAmount: amount,
                stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
                takeProfit: takeProfit ? parseFloat(takeProfit) : undefined,
                walletAddress: account,
            });
            setIsRunning(true);
        }
        catch (err) {
            setError("Failed to start trading bot. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleStopTrading = async () => {
        if (!account)
            return;
        setLoading(true);
        try {
            await tradingBotService_1.tradingBotService.stopBot(account);
            setIsRunning(false);
        }
        catch (err) {
            setError("Failed to stop trading bot. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const formatDuration = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };
    const handleStrategyChange = (strategyId) => {
        setSelectedStrategy(strategyId);
        const strategy = tradingBotService_1.tradingBotService.getStrategy(strategyId);
        if (strategy) {
            setStopLoss(strategy.defaultStopLoss.toString());
            setTakeProfit(strategy.defaultTakeProfit.toString());
        }
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mb: 4 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", gutterBottom: true, sx: { mb: 3 }, children: "Auto Trading" }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 3, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 8, children: (0, jsx_runtime_1.jsx)(material_1.Paper, { sx: { p: 3, height: "100%" }, children: (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 3, children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 12, children: [(0, jsx_runtime_1.jsxs)(material_1.FormControl, { fullWidth: true, children: [(0, jsx_runtime_1.jsx)(material_1.InputLabel, { children: "Trading Strategy" }), (0, jsx_runtime_1.jsx)(material_1.Select, { value: selectedStrategy, onChange: (e) => handleStrategyChange(e.target.value), label: "Trading Strategy", children: tradingBotService_1.tradingBotService.strategies.map((strategy) => ((0, jsx_runtime_1.jsxs)(material_1.MenuItem, { value: strategy.id, children: [strategy.name, " - ", strategy.risk, " Risk"] }, strategy.id))) })] }), selectedStrategy && ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                                                    mt: 2,
                                                    p: 2,
                                                    bgcolor: "background.default",
                                                    borderRadius: 1,
                                                }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", color: "primary", gutterBottom: true, children: "Strategy Details" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: tradingBotService_1.tradingBotService.getStrategy(selectedStrategy)
                                                            ?.description }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mt: 1, display: "flex", gap: 3 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", color: "text.secondary", children: ["Expected Return:", " ", tradingBotService_1.tradingBotService.getStrategy(selectedStrategy)
                                                                        ?.expectedReturn] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", color: "text.secondary", children: ["Timeframe:", " ", tradingBotService_1.tradingBotService.getStrategy(selectedStrategy)
                                                                        ?.timeframe] })] })] }))] }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, label: "Investment Amount (USD)", type: "number", value: investmentAmount, onChange: (e) => setInvestmentAmount(e.target.value), InputProps: {
                                                inputProps: {
                                                    min: selectedStrategy
                                                        ? tradingBotService_1.tradingBotService.getStrategy(selectedStrategy)
                                                            ?.minInvestment
                                                        : 0,
                                                    max: selectedStrategy
                                                        ? tradingBotService_1.tradingBotService.getStrategy(selectedStrategy)
                                                            ?.maxInvestment
                                                        : undefined,
                                                },
                                            }, helperText: selectedStrategy
                                                ? `Min: $${tradingBotService_1.tradingBotService.getStrategy(selectedStrategy)
                                                    ?.minInvestment} - Max: $${tradingBotService_1.tradingBotService.getStrategy(selectedStrategy)
                                                    ?.maxInvestment}`
                                                : undefined }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsx)(material_1.FormControlLabel, { control: (0, jsx_runtime_1.jsx)(material_1.Switch, { checked: showAdvanced, onChange: (e) => setShowAdvanced(e.target.checked) }), label: "Show Advanced Settings" }) }), showAdvanced && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, label: "Stop Loss (%)", type: "number", value: stopLoss, onChange: (e) => setStopLoss(e.target.value), InputProps: { inputProps: { min: 0, max: 100 } } }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsx)(material_1.TextField, { fullWidth: true, label: "Take Profit (%)", type: "number", value: takeProfit, onChange: (e) => setTakeProfit(e.target.value), InputProps: { inputProps: { min: 0, max: 1000 } } }) })] })), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", gap: 2, alignItems: "center" }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: isRunning ? "error" : "primary", onClick: isRunning ? handleStopTrading : handleStartTrading, startIcon: isRunning ? (0, jsx_runtime_1.jsx)(icons_material_1.Stop, {}) : (0, jsx_runtime_1.jsx)(icons_material_1.PlayArrow, {}), disabled: loading || !account, size: "large", children: loading ? ((0, jsx_runtime_1.jsx)(material_1.CircularProgress, { size: 24, color: "inherit" })) : isRunning ? ("Stop Trading") : ("Start Trading") }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "outlined", startIcon: (0, jsx_runtime_1.jsx)(icons_material_1.Settings, {}), onClick: () => setShowAdvanced(!showAdvanced), children: "Settings" })] }) }), error && ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "error", children: error }) })), !account && ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsx)(material_1.Alert, { severity: "warning", children: "Please connect your wallet to start trading" }) }))] }) }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 4, children: (0, jsx_runtime_1.jsxs)(material_1.Paper, { sx: { p: 3, height: "100%" }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: "Trading Statistics" }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { height: 200, mb: 3 }, children: (0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsxs)(recharts_1.AreaChart, { data: performanceData, children: [(0, jsx_runtime_1.jsx)(recharts_1.XAxis, { dataKey: "time" }), (0, jsx_runtime_1.jsx)(recharts_1.YAxis, {}), (0, jsx_runtime_1.jsx)(recharts_1.Tooltip, {}), (0, jsx_runtime_1.jsx)(recharts_1.Area, { type: "monotone", dataKey: "profit", stroke: theme.palette.primary.main, fill: theme.palette.primary.light, fillOpacity: 0.3 })] }) }) }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 2, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsx)(material_1.Card, { children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", alignItems: "center", mb: 1 }, children: [(0, jsx_runtime_1.jsx)(icons_material_1.AttachMoney, { color: "primary" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", sx: { ml: 1 }, children: "Total Profit/Loss" })] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h4", color: stats.totalProfit >= 0 ? "success.main" : "error.main", children: ["$", stats.totalProfit.toFixed(2)] })] }) }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsx)(material_1.Card, { children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", alignItems: "center", mb: 1 }, children: [(0, jsx_runtime_1.jsx)(icons_material_1.TrendingUp, { color: "primary" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", sx: { ml: 1 }, children: "Performance" })] }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 1, children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 6, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: "Total Trades" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: stats.totalTrades })] }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 6, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: "Win Rate" }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h6", children: [(stats.winRate * 100).toFixed(1), "%"] })] })] })] }) }) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsx)(material_1.Card, { children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", alignItems: "center", mb: 1 }, children: [(0, jsx_runtime_1.jsx)(icons_material_1.Timeline, { color: "primary" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle1", sx: { ml: 1 }, children: "Active Time & Last Price" })] }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 1, children: [(0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 6, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: "Active Time" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: formatDuration(stats.activeTime) })] }), (0, jsx_runtime_1.jsxs)(material_1.Grid, { item: true, xs: 6, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: "Last Price" }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "h6", children: ["$", stats.lastPrice.toFixed(2)] })] })] })] }) }) }), stats.currentPosition && ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsx)(material_1.Card, { children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: "Current Position" }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", color: stats.currentPosition === "long"
                                                                ? "success.main"
                                                                : "error.main", children: stats.currentPosition.toUpperCase() }), stats.lastTradeTime && ((0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "caption", color: "text.secondary", children: ["Last trade:", " ", new Date(stats.lastTradeTime).toLocaleTimeString()] }))] }) }) }))] })] }) })] })] }));
};
exports.default = AutoTrading;
