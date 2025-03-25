import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Typography, Paper, IconButton, } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
const data = [
    { name: 'Stock name', value: 35, color: '#F59E0B' },
    { name: 'Stock name', value: 25, color: '#EC4899' },
    { name: 'Stock name', value: 40, color: '#3B82F6' },
];
const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const Investments = () => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
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
    return (_jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3
                }, children: [_jsx(Typography, { variant: "h6", children: "Investments" }), _jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(IconButton, { size: "small", onClick: handlePrevMonth, children: _jsx(ChevronLeft, {}) }), _jsx(Typography, { variant: "body2", children: currentMonthDisplay }), _jsx(IconButton, { size: "small", onClick: handleNextMonth, children: _jsx(ChevronRight, {}) })] })] }), _jsxs(Box, { sx: {
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }, children: [_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsx(PieChart, { children: _jsx(Pie, { data: data, innerRadius: 60, outerRadius: 80, paddingAngle: 5, dataKey: "value", children: data.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }) }) }), _jsx(Box, { sx: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                        }, children: _jsx(Typography, { variant: "h4", children: "45623" }) })] }), _jsx(Box, { sx: { mt: 2 }, children: data.map((item, index) => (_jsxs(Box, { sx: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1
                    }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 }, children: [_jsx(Box, { sx: {
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: item.color
                                    } }), _jsx(Typography, { variant: "body2", children: item.name })] }), _jsxs(Typography, { variant: "body2", sx: { color: 'success.main' }, children: ["+", item.value, "%"] })] }, index))) })] }));
};
export default Investments;
