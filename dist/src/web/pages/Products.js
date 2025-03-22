"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const products = [
    {
        title: 'AI Trading Bot',
        description: 'Advanced trading bot powered by machine learning algorithms for optimal trading strategies.',
        icon: icons_material_1.AutoGraph,
        features: [
            'Real-time market analysis',
            'Custom trading strategies',
            'Risk management',
            'Performance analytics'
        ]
    },
    {
        title: 'Liquidity Pool Management',
        description: 'Efficient liquidity pool management with automated rebalancing and yield optimization.',
        icon: icons_material_1.AccountBalance,
        features: [
            'Automated rebalancing',
            'Yield optimization',
            'Risk assessment',
            'Pool analytics'
        ]
    },
    {
        title: 'High-Frequency Trading',
        description: 'Ultra-fast trading execution with minimal latency and maximum efficiency.',
        icon: icons_material_1.Speed,
        features: [
            'Low latency execution',
            'Market making',
            'Arbitrage opportunities',
            'Advanced order types'
        ]
    },
    {
        title: 'Secure Wallet Integration',
        description: 'Enterprise-grade security for your digital assets with multi-signature support.',
        icon: icons_material_1.Security,
        features: [
            'Multi-signature support',
            'Hardware wallet integration',
            'Transaction monitoring',
            'Access control'
        ]
    }
];
const Products = () => {
    return ((0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "xl", sx: { py: 8 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h3", component: "h1", gutterBottom: true, align: "center", sx: { mb: 6 }, children: "Our Products" }), (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true, spacing: 4, children: products.map((product, index) => {
                    const Icon = product.icon;
                    return ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsx)(material_1.Card, { sx: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out'
                                }
                            }, children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { sx: { flexGrow: 1 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [(0, jsx_runtime_1.jsx)(Icon, { sx: { fontSize: 40, mr: 2, color: 'primary.main' } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", component: "h2", children: product.title })] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: product.description }), (0, jsx_runtime_1.jsx)(material_1.Box, { component: "ul", sx: { pl: 2 }, children: product.features.map((feature, idx) => ((0, jsx_runtime_1.jsx)(material_1.Typography, { component: "li", variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: feature }, idx))) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { mt: 2 }, children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", children: "Learn More" }) })] }) }) }, index));
                }) })] }));
};
exports.default = Products;
