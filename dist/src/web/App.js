import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, Button, Container, CssBaseline, Grid, IconButton, List, ListItem, ListItemText, ThemeProvider, Toolbar, Typography, createTheme, useMediaQuery, useTheme, } from "@mui/material";
import { useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AutoTrading from "./components/AutoTrading";
import CryptoList from "./components/CryptoList";
import MarketUpdate from "./components/MarketUpdate";
import PetraWalletConnect from "./components/PetraWalletConnect";
import TransactionHistory from "./components/TransactionHistory";
import Community from "./pages/Community";
import Products from "./pages/Products";
import Resources from "./pages/Resources";
import Solutions from "./pages/Solutions";
import { PetraProvider } from "./providers/PetraProvider";
const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#3B82F6",
        },
        background: {
            default: "#111827",
            paper: "#1F2937",
        },
    },
});
const navigationItems = [
    { path: "/", label: "Dashboard" },
    { path: "/products", label: "Products" },
    { path: "/solutions", label: "Solutions" },
    { path: "/community", label: "Community" },
    { path: "/resources", label: "Resources" },
];
const App = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const Navigation = () => (_jsx(List, { children: navigationItems.map((item) => (_jsx(ListItem, { component: Link, to: item.path, sx: {
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                    bgcolor: "action.hover",
                },
            }, children: _jsx(ListItemText, { primary: item.label }) }, item.path))) }));
    return (_jsx(ThemeProvider, { theme: darkTheme, children: _jsx(PetraProvider, { children: _jsx(Router, { children: _jsxs(Box, { sx: { display: "flex", minHeight: "100vh" }, children: [_jsx(CssBaseline, {}), _jsx(AppBar, { position: "fixed", children: _jsxs(Toolbar, { children: [_jsx(IconButton, { color: "inherit", "aria-label": "open drawer", edge: "start", onClick: handleDrawerToggle, sx: { mr: 2, display: { sm: "none" } }, children: _jsx(MenuIcon, {}) }), _jsx(Typography, { variant: "h6", noWrap: true, component: "div", sx: { flexGrow: 1 }, children: "AetherAI Trading" }), _jsx(Box, { sx: { display: { xs: "none", md: "flex" }, gap: 2, mr: 4 }, children: navigationItems.map((item) => (_jsx(Button, { component: Link, to: item.path, color: "inherit", children: item.label }, item.path))) }), _jsx(PetraWalletConnect, {})] }) }), isMobile && mobileOpen && (_jsx(Box, { component: "nav", sx: {
                                width: 240,
                                flexShrink: 0,
                                position: "fixed",
                                zIndex: theme.zIndex.appBar - 1,
                                top: 64,
                                bottom: 0,
                                bgcolor: "background.paper",
                                overflowY: "auto",
                            }, children: _jsx(Navigation, {}) })), _jsx(Container, { maxWidth: "xl", sx: { mt: 10, mb: 4, width: "100%" }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, lg: 8, children: _jsx(MarketUpdate, {}) }), _jsx(Grid, { item: true, xs: 12, lg: 4, children: _jsx(CryptoList, {}) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(AutoTrading, {}) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TransactionHistory, {}) })] }) }), _jsx(Route, { path: "/products", element: _jsx(Products, {}) }), _jsx(Route, { path: "/solutions", element: _jsx(Solutions, {}) }), _jsx(Route, { path: "/community", element: _jsx(Community, {}) }), _jsx(Route, { path: "/resources", element: _jsx(Resources, {}) })] }) })] }) }) }) }));
};
export default App;
