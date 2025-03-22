"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const solutions = [
    {
        title: 'DeFi Trading',
        description: 'Automated DeFi trading solutions with advanced portfolio management and risk assessment.',
        icon: icons_material_1.TrendingUp,
        benefits: [
            'Automated yield farming',
            'Cross-chain trading',
            'Impermanent loss protection',
            'Gas optimization'
        ]
    },
    {
        title: 'Market Analysis',
        description: 'Real-time market analysis with AI-powered insights and predictive modeling.',
        icon: icons_material_1.Analytics,
        benefits: [
            'Market sentiment analysis',
            'Technical indicators',
            'Price prediction models',
            'Trading signals'
        ]
    },
    {
        title: 'Asset Management',
        description: 'Professional-grade digital asset management with institutional security.',
        icon: icons_material_1.AccountBalanceWallet,
        benefits: [
            'Portfolio rebalancing',
            'Risk management',
            'Performance tracking',
            'Tax reporting'
        ]
    },
    {
        title: 'Security Solutions',
        description: 'Enterprise-level security solutions for digital asset protection.',
        icon: icons_material_1.Shield,
        benefits: [
            'Multi-signature wallets',
            'Cold storage',
            'Audit trails',
            'Access control'
        ]
    }
];
const Solutions = () => {
    return ((0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "xl", sx: { py: 8 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h3", component: "h1", gutterBottom: true, align: "center", sx: { mb: 6 }, children: "Solutions" }), (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true, spacing: 4, children: solutions.map((solution, index) => {
                    const Icon = solution.icon;
                    return ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsx)(material_1.Card, { sx: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out'
                                }
                            }, children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { sx: { flexGrow: 1 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [(0, jsx_runtime_1.jsx)(Icon, { sx: { fontSize: 40, mr: 2, color: 'primary.main' } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", component: "h2", children: solution.title })] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: solution.description }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", sx: { mb: 2 }, children: "Key Benefits" }), (0, jsx_runtime_1.jsx)(material_1.Box, { component: "ul", sx: { pl: 2 }, children: solution.benefits.map((benefit, idx) => ((0, jsx_runtime_1.jsx)(material_1.Typography, { component: "li", variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: benefit }, idx))) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { mt: 2 }, children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", children: "Learn More" }) })] }) }) }, index));
                }) })] }));
};
exports.default = Solutions;
