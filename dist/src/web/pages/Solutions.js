import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Grid, Typography, Card, CardContent, Box, Button, } from '@mui/material';
import { TrendingUp, Analytics, AccountBalanceWallet, Shield } from '@mui/icons-material';
const solutions = [
    {
        title: 'DeFi Trading',
        description: 'Automated DeFi trading solutions with advanced portfolio management and risk assessment.',
        icon: TrendingUp,
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
        icon: Analytics,
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
        icon: AccountBalanceWallet,
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
        icon: Shield,
        benefits: [
            'Multi-signature wallets',
            'Cold storage',
            'Audit trails',
            'Access control'
        ]
    }
];
const Solutions = () => {
    return (_jsxs(Container, { maxWidth: "xl", sx: { py: 8 }, children: [_jsx(Typography, { variant: "h3", component: "h1", gutterBottom: true, align: "center", sx: { mb: 6 }, children: "Solutions" }), _jsx(Grid, { container: true, spacing: 4, children: solutions.map((solution, index) => {
                    const Icon = solution.icon;
                    return (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { sx: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out'
                                }
                            }, children: _jsxs(CardContent, { sx: { flexGrow: 1 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(Icon, { sx: { fontSize: 40, mr: 2, color: 'primary.main' } }), _jsx(Typography, { variant: "h5", component: "h2", children: solution.title })] }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: solution.description }), _jsx(Typography, { variant: "h6", sx: { mb: 2 }, children: "Key Benefits" }), _jsx(Box, { component: "ul", sx: { pl: 2 }, children: solution.benefits.map((benefit, idx) => (_jsx(Typography, { component: "li", variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: benefit }, idx))) }), _jsx(Box, { sx: { mt: 2 }, children: _jsx(Button, { variant: "contained", color: "primary", children: "Learn More" }) })] }) }) }, index));
                }) })] }));
};
export default Solutions;
