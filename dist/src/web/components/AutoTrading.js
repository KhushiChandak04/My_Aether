import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { AttachMoney, PlayArrow, Settings, Stop, Timeline, TrendingUp, } from "@mui/icons-material";
import { Alert, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Switch, TextField, Typography, useTheme, } from "@mui/material";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { tradingBotService, } from "../../services/tradingBotService";
import { usePetra } from "../providers/PetraProvider";
const AutoTrading = () => {
    const { account } = usePetra();
    const theme = useTheme();
    const [selectedStrategy, setSelectedStrategy] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [investmentAmount, setInvestmentAmount] = useState("");
    const [stopLoss, setStopLoss] = useState("");
    const [takeProfit, setTakeProfit] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [performanceData, setPerformanceData] = useState([]);
    const [stats, setStats] = useState({
        totalProfit: 0,
        totalTrades: 0,
        winRate: 0,
        activeTime: 0,
        lastPrice: 0,
        currentPosition: null,
        lastTradeTime: null,
    });
    useEffect(() => {
        if (account) {
            const loadStrategyDetails = async () => {
                try {
                    const strategyDetails = await tradingBotService.aptosService.getStrategyDetails(account, Date.now());
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
    useEffect(() => {
        if (account && isRunning) {
            const interval = setInterval(() => {
                const currentStats = tradingBotService.getStats(account);
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
        const strategy = tradingBotService.strategies.find((s) => s.id === selectedStrategy);
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
            await tradingBotService.startBot({
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
            await tradingBotService.stopBot(account);
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
        const strategy = tradingBotService.getStrategy(strategyId);
        if (strategy) {
            setStopLoss(strategy.defaultStopLoss.toString());
            setTakeProfit(strategy.defaultTakeProfit.toString());
        }
    };
    return (_jsxs(Box, { sx: { mb: 4 }, children: [_jsx(Typography, { variant: "h5", gutterBottom: true, sx: { mb: 3 }, children: "Auto Trading" }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 8, children: _jsx(Paper, { sx: { p: 3, height: "100%" }, children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsxs(Grid, { item: true, xs: 12, children: [_jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { children: "Trading Strategy" }), _jsx(Select, { value: selectedStrategy, onChange: (e) => handleStrategyChange(e.target.value), label: "Trading Strategy", children: tradingBotService.strategies.map((strategy) => (_jsxs(MenuItem, { value: strategy.id, children: [strategy.name, " - ", strategy.risk, " Risk"] }, strategy.id))) })] }), selectedStrategy && (_jsxs(Box, { sx: {
                                                    mt: 2,
                                                    p: 2,
                                                    bgcolor: "background.default",
                                                    borderRadius: 1,
                                                }, children: [_jsx(Typography, { variant: "subtitle2", color: "primary", gutterBottom: true, children: "Strategy Details" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: tradingBotService.getStrategy(selectedStrategy)
                                                            ?.description }), _jsxs(Box, { sx: { mt: 1, display: "flex", gap: 3 }, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Expected Return:", " ", tradingBotService.getStrategy(selectedStrategy)
                                                                        ?.expectedReturn] }), _jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["Timeframe:", " ", tradingBotService.getStrategy(selectedStrategy)
                                                                        ?.timeframe] })] })] }))] }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Investment Amount (USD)", type: "number", value: investmentAmount, onChange: (e) => setInvestmentAmount(e.target.value), InputProps: {
                                                inputProps: {
                                                    min: selectedStrategy
                                                        ? tradingBotService.getStrategy(selectedStrategy)
                                                            ?.minInvestment
                                                        : 0,
                                                    max: selectedStrategy
                                                        ? tradingBotService.getStrategy(selectedStrategy)
                                                            ?.maxInvestment
                                                        : undefined,
                                                },
                                            }, helperText: selectedStrategy
                                                ? `Min: $${tradingBotService.getStrategy(selectedStrategy)
                                                    ?.minInvestment} - Max: $${tradingBotService.getStrategy(selectedStrategy)
                                                    ?.maxInvestment}`
                                                : undefined }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(FormControlLabel, { control: _jsx(Switch, { checked: showAdvanced, onChange: (e) => setShowAdvanced(e.target.checked) }), label: "Show Advanced Settings" }) }), showAdvanced && (_jsxs(_Fragment, { children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Stop Loss (%)", type: "number", value: stopLoss, onChange: (e) => setStopLoss(e.target.value), InputProps: { inputProps: { min: 0, max: 100 } } }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(TextField, { fullWidth: true, label: "Take Profit (%)", type: "number", value: takeProfit, onChange: (e) => setTakeProfit(e.target.value), InputProps: { inputProps: { min: 0, max: 1000 } } }) })] })), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Box, { sx: { display: "flex", gap: 2, alignItems: "center" }, children: [_jsx(Button, { variant: "contained", color: isRunning ? "error" : "primary", onClick: isRunning ? handleStopTrading : handleStartTrading, startIcon: isRunning ? _jsx(Stop, {}) : _jsx(PlayArrow, {}), disabled: loading || !account, size: "large", children: loading ? (_jsx(CircularProgress, { size: 24, color: "inherit" })) : isRunning ? ("Stop Trading") : ("Start Trading") }), _jsx(Button, { variant: "outlined", startIcon: _jsx(Settings, {}), onClick: () => setShowAdvanced(!showAdvanced), children: "Settings" })] }) }), error && (_jsx(Grid, { item: true, xs: 12, children: _jsx(Alert, { severity: "error", children: error }) })), !account && (_jsx(Grid, { item: true, xs: 12, children: _jsx(Alert, { severity: "warning", children: "Please connect your wallet to start trading" }) }))] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 4, children: _jsxs(Paper, { sx: { p: 3, height: "100%" }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Trading Statistics" }), _jsx(Box, { sx: { height: 200, mb: 3 }, children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: performanceData, children: [_jsx(XAxis, { dataKey: "time" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "profit", stroke: theme.palette.primary.main, fill: theme.palette.primary.light, fillOpacity: 0.3 })] }) }) }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", mb: 1 }, children: [_jsx(AttachMoney, { color: "primary" }), _jsx(Typography, { variant: "subtitle1", sx: { ml: 1 }, children: "Total Profit/Loss" })] }), _jsxs(Typography, { variant: "h4", color: stats.totalProfit >= 0 ? "success.main" : "error.main", children: ["$", stats.totalProfit.toFixed(2)] })] }) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", mb: 1 }, children: [_jsx(TrendingUp, { color: "primary" }), _jsx(Typography, { variant: "subtitle1", sx: { ml: 1 }, children: "Performance" })] }), _jsxs(Grid, { container: true, spacing: 1, children: [_jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Total Trades" }), _jsx(Typography, { variant: "h6", children: stats.totalTrades })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Win Rate" }), _jsxs(Typography, { variant: "h6", children: [(stats.winRate * 100).toFixed(1), "%"] })] })] })] }) }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsxs(Box, { sx: { display: "flex", alignItems: "center", mb: 1 }, children: [_jsx(Timeline, { color: "primary" }), _jsx(Typography, { variant: "subtitle1", sx: { ml: 1 }, children: "Active Time & Last Price" })] }), _jsxs(Grid, { container: true, spacing: 1, children: [_jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Active Time" }), _jsx(Typography, { variant: "h6", children: formatDuration(stats.activeTime) })] }), _jsxs(Grid, { item: true, xs: 6, children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: "Last Price" }), _jsxs(Typography, { variant: "h6", children: ["$", stats.lastPrice.toFixed(2)] })] })] })] }) }) }), stats.currentPosition && (_jsx(Grid, { item: true, xs: 12, children: _jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "subtitle2", color: "text.secondary", gutterBottom: true, children: "Current Position" }), _jsx(Typography, { variant: "h6", color: stats.currentPosition === "long"
                                                                ? "success.main"
                                                                : "error.main", children: stats.currentPosition.toUpperCase() }), stats.lastTradeTime && (_jsxs(Typography, { variant: "caption", color: "text.secondary", children: ["Last trade:", " ", new Date(stats.lastTradeTime).toLocaleTimeString()] }))] }) }) }))] })] }) })] })] }));
};
export default AutoTrading;
