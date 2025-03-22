"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const icons_material_1 = require("@mui/icons-material");
const material_1 = require("@mui/material");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const AutoTrading_1 = __importDefault(require("./components/AutoTrading"));
const CryptoList_1 = __importDefault(require("./components/CryptoList"));
const MarketUpdate_1 = __importDefault(require("./components/MarketUpdate"));
const PetraWalletConnect_1 = __importDefault(require("./components/PetraWalletConnect"));
const TransactionHistory_1 = __importDefault(require("./components/TransactionHistory"));
const Community_1 = __importDefault(require("./pages/Community"));
const Products_1 = __importDefault(require("./pages/Products"));
const Resources_1 = __importDefault(require("./pages/Resources"));
const Solutions_1 = __importDefault(require("./pages/Solutions"));
const PetraProvider_1 = require("./providers/PetraProvider");
const darkTheme = (0, material_1.createTheme)({
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
    const [mobileOpen, setMobileOpen] = (0, react_1.useState)(false);
    const theme = (0, material_1.useTheme)();
    const isMobile = (0, material_1.useMediaQuery)(theme.breakpoints.down("sm"));
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const Navigation = () => ((0, jsx_runtime_1.jsx)(material_1.List, { children: navigationItems.map((item) => ((0, jsx_runtime_1.jsx)(material_1.ListItem, { component: react_router_dom_1.Link, to: item.path, sx: {
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                    bgcolor: "action.hover",
                },
            }, children: (0, jsx_runtime_1.jsx)(material_1.ListItemText, { primary: item.label }) }, item.path))) }));
    return ((0, jsx_runtime_1.jsx)(material_1.ThemeProvider, { theme: darkTheme, children: (0, jsx_runtime_1.jsx)(PetraProvider_1.PetraProvider, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.BrowserRouter, { children: (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: "flex", minHeight: "100vh" }, children: [(0, jsx_runtime_1.jsx)(material_1.CssBaseline, {}), (0, jsx_runtime_1.jsx)(material_1.AppBar, { position: "fixed", children: (0, jsx_runtime_1.jsxs)(material_1.Toolbar, { children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { color: "inherit", "aria-label": "open drawer", edge: "start", onClick: handleDrawerToggle, sx: { mr: 2, display: { sm: "none" } }, children: (0, jsx_runtime_1.jsx)(icons_material_1.Menu, {}) }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", noWrap: true, component: "div", sx: { flexGrow: 1 }, children: "AetherAI Trading" }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { display: { xs: "none", md: "flex" }, gap: 2, mr: 4 }, children: navigationItems.map((item) => ((0, jsx_runtime_1.jsx)(material_1.Button, { component: react_router_dom_1.Link, to: item.path, color: "inherit", children: item.label }, item.path))) }), (0, jsx_runtime_1.jsx)(PetraWalletConnect_1.default, {})] }) }), isMobile && mobileOpen && ((0, jsx_runtime_1.jsx)(material_1.Box, { component: "nav", sx: {
                                width: 240,
                                flexShrink: 0,
                                position: "fixed",
                                zIndex: theme.zIndex.appBar - 1,
                                top: 64,
                                bottom: 0,
                                bgcolor: "background.paper",
                                overflowY: "auto",
                            }, children: (0, jsx_runtime_1.jsx)(Navigation, {}) })), (0, jsx_runtime_1.jsx)(material_1.Container, { maxWidth: "xl", sx: { mt: 10, mb: 4, width: "100%" }, children: (0, jsx_runtime_1.jsxs)(react_router_dom_1.Routes, { children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/", element: (0, jsx_runtime_1.jsxs)(material_1.Grid, { container: true, spacing: 3, children: [(0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, lg: 8, children: (0, jsx_runtime_1.jsx)(MarketUpdate_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, lg: 4, children: (0, jsx_runtime_1.jsx)(CryptoList_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsx)(AutoTrading_1.default, {}) }), (0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, children: (0, jsx_runtime_1.jsx)(TransactionHistory_1.default, {}) })] }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/products", element: (0, jsx_runtime_1.jsx)(Products_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/solutions", element: (0, jsx_runtime_1.jsx)(Solutions_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/community", element: (0, jsx_runtime_1.jsx)(Community_1.default, {}) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Route, { path: "/resources", element: (0, jsx_runtime_1.jsx)(Resources_1.default, {}) })] }) })] }) }) }) }));
};
exports.default = App;
