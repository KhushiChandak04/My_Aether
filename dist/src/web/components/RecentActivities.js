import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Box, Typography, Paper, ButtonGroup, Button, Table, TableBody, TableCell, TableContainer, TableRow, } from '@mui/material';
const activities = [
    { title: 'title', type: 'tp', code: 'NFR53.495', change: -0.11 },
    { title: 'title', type: 'tp', code: 'NFR15.9', change: -2.1 },
    { title: 'title', type: 'tp', code: 'NFR15.978', change: -2.5 },
    { title: 'title', type: 'tp', code: 'NFR4.955', change: +0.11 },
    { title: 'title', type: 'tp', code: 'NFR287', change: -0.42 },
    { title: 'title', type: 'tp', code: 'NFR0.49', change: -1.1 },
];
const RecentActivities = () => {
    const [filter, setFilter] = React.useState('markets');
    return (_jsxs(Paper, { sx: { p: 3 }, children: [_jsxs(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }, children: [_jsx(Typography, { variant: "h6", children: "Recent Activities" }), _jsxs(ButtonGroup, { size: "small", children: [_jsx(Button, { variant: filter === 'markets' ? 'contained' : 'outlined', onClick: () => setFilter('markets'), children: "Markets" }), _jsx(Button, { variant: filter === 'nifty' ? 'contained' : 'outlined', onClick: () => setFilter('nifty'), children: "NIFTY" }), _jsx(Button, { variant: filter === 'niftyb' ? 'contained' : 'outlined', onClick: () => setFilter('niftyb'), children: "NIFTYB" }), _jsx(Button, { variant: filter === 'ipo' ? 'contained' : 'outlined', onClick: () => setFilter('ipo'), children: "IPO" }), _jsx(Button, { variant: filter === 'nit' ? 'contained' : 'outlined', onClick: () => setFilter('nit'), children: "NIT" })] })] }), _jsx(TableContainer, { children: _jsx(Table, { size: "small", children: _jsx(TableBody, { children: activities.map((activity, index) => (_jsxs(TableRow, { sx: { '&:last-child td, &:last-child th': { border: 0 } }, children: [_jsxs(TableCell, { sx: { width: '30%' }, children: [_jsx(Typography, { variant: "body2", children: activity.title }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: activity.type })] }), _jsx(TableCell, { children: _jsx(Typography, { variant: "body2", children: activity.code }) }), _jsx(TableCell, { align: "right", children: _jsxs(Typography, { variant: "body2", sx: {
                                            color: activity.change >= 0 ? 'success.main' : 'error.main',
                                            fontWeight: 500
                                        }, children: [activity.change >= 0 ? '+' : '', activity.change, "%"] }) })] }, index))) }) }) }), _jsx(Box, { sx: { mt: 2, textAlign: 'center' }, children: _jsx(Button, { color: "primary", size: "small", children: "View All" }) })] }));
};
export default RecentActivities;
