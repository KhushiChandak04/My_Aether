"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
const activities = [
    { title: 'title', type: 'tp', code: 'NFR53.495', change: -0.11 },
    { title: 'title', type: 'tp', code: 'NFR15.9', change: -2.1 },
    { title: 'title', type: 'tp', code: 'NFR15.978', change: -2.5 },
    { title: 'title', type: 'tp', code: 'NFR4.955', change: +0.11 },
    { title: 'title', type: 'tp', code: 'NFR287', change: -0.42 },
    { title: 'title', type: 'tp', code: 'NFR0.49', change: -1.1 },
];
const RecentActivities = () => {
    const [filter, setFilter] = react_1.default.useState('markets');
    return ((0, jsx_runtime_1.jsxs)(material_1.Paper, { sx: { p: 3 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Recent Activities" }), (0, jsx_runtime_1.jsxs)(material_1.ButtonGroup, { size: "small", children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: filter === 'markets' ? 'contained' : 'outlined', onClick: () => setFilter('markets'), children: "Markets" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: filter === 'nifty' ? 'contained' : 'outlined', onClick: () => setFilter('nifty'), children: "NIFTY" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: filter === 'niftyb' ? 'contained' : 'outlined', onClick: () => setFilter('niftyb'), children: "NIFTYB" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: filter === 'ipo' ? 'contained' : 'outlined', onClick: () => setFilter('ipo'), children: "IPO" }), (0, jsx_runtime_1.jsx)(material_1.Button, { variant: filter === 'nit' ? 'contained' : 'outlined', onClick: () => setFilter('nit'), children: "NIT" })] })] }), (0, jsx_runtime_1.jsx)(material_1.TableContainer, { children: (0, jsx_runtime_1.jsx)(material_1.Table, { size: "small", children: (0, jsx_runtime_1.jsx)(material_1.TableBody, { children: activities.map((activity, index) => ((0, jsx_runtime_1.jsxs)(material_1.TableRow, { sx: { '&:last-child td, &:last-child th': { border: 0 } }, children: [(0, jsx_runtime_1.jsxs)(material_1.TableCell, { sx: { width: '30%' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: activity.title }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "caption", color: "text.secondary", children: activity.type })] }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { children: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: activity.code }) }), (0, jsx_runtime_1.jsx)(material_1.TableCell, { align: "right", children: (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", sx: {
                                            color: activity.change >= 0 ? 'success.main' : 'error.main',
                                            fontWeight: 500
                                        }, children: [activity.change >= 0 ? '+' : '', activity.change, "%"] }) })] }, index))) }) }) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { mt: 2, textAlign: 'center' }, children: (0, jsx_runtime_1.jsx)(material_1.Button, { color: "primary", size: "small", children: "View All" }) })] }));
};
exports.default = RecentActivities;
