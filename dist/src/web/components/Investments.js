"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const recharts_1 = require("recharts");
const data = [
    { name: 'Stock name', value: 35, color: '#F59E0B' },
    { name: 'Stock name', value: 25, color: '#EC4899' },
    { name: 'Stock name', value: 40, color: '#3B82F6' },
];
const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const Investments = () => {
    const [currentDate, setCurrentDate] = react_1.default.useState(new Date());
    const currentMonthDisplay = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    const handlePrevMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };
    const handleNextMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };
    return ((0, jsx_runtime_1.jsxs)(material_1.Paper, { sx: { p: 3 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", children: "Investments" }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "small", onClick: handlePrevMonth, children: (0, jsx_runtime_1.jsx)(icons_material_1.ChevronLeft, {}) }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: currentMonthDisplay }), (0, jsx_runtime_1.jsx)(material_1.IconButton, { size: "small", onClick: handleNextMonth, children: (0, jsx_runtime_1.jsx)(icons_material_1.ChevronRight, {}) })] })] }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }, children: [(0, jsx_runtime_1.jsx)(recharts_1.ResponsiveContainer, { width: "100%", height: "100%", children: (0, jsx_runtime_1.jsx)(recharts_1.PieChart, { children: (0, jsx_runtime_1.jsx)(recharts_1.Pie, { data: data, innerRadius: 60, outerRadius: 80, paddingAngle: 5, dataKey: "value", children: data.map((entry, index) => ((0, jsx_runtime_1.jsx)(recharts_1.Cell, { fill: entry.color }, `cell-${index}`))) }) }) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                        }, children: (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", children: "45623" }) })] }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { mt: 2 }, children: data.map((item, index) => ((0, jsx_runtime_1.jsxs)(material_1.Box, { sx: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1
                    }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [(0, jsx_runtime_1.jsx)(material_1.Box, { sx: {
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: item.color
                                    } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", children: item.name })] }), (0, jsx_runtime_1.jsxs)(material_1.Typography, { variant: "body2", sx: { color: 'success.main' }, children: ["+", item.value, "%"] })] }, index))) })] }));
};
exports.default = Investments;
