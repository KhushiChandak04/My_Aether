import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Container, Grid, Typography, Card, CardContent, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Grow, } from '@mui/material';
import { AutoGraph, AccountBalance, Speed, Security, Close } from '@mui/icons-material';
const products = [
    {
        title: 'AI Trading Bot',
        description: 'Advanced trading bot powered by machine learning algorithms for optimal trading strategies.',
        icon: AutoGraph,
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
        icon: AccountBalance,
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
        icon: Speed,
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
        icon: Security,
        features: [
            'Multi-signature support',
            'Hardware wallet integration',
            'Transaction monitoring',
            'Access control'
        ]
    }
];
const getFeatureDescription = (productTitle, feature) => {
    const descriptions = {
        'AI Trading Bot': {
            'Real-time market analysis': 'Advanced algorithms analyze market trends, patterns, and indicators in real-time to identify trading opportunities.',
            'Custom trading strategies': 'Create and customize trading strategies based on your risk tolerance and investment goals.',
            'Risk management': 'Sophisticated risk management tools to protect your investments and limit potential losses.',
            'Performance analytics': 'Detailed analytics and reporting to track your trading performance and optimize strategies.'
        },
        'Liquidity Pool Management': {
            'Automated rebalancing': 'Smart rebalancing algorithms maintain optimal token ratios to maximize returns and minimize impermanent loss.',
            'Yield optimization': 'Automatically identifies and allocates funds to the highest-yielding opportunities across different protocols.',
            'Risk assessment': 'Continuous monitoring of pool health and risk metrics to ensure safe and profitable operations.',
            'Pool analytics': 'Comprehensive analytics dashboard for monitoring pool performance, fees, and returns.'
        },
        'High-Frequency Trading': {
            'Low latency execution': 'Ultra-fast order execution with minimal slippage using advanced infrastructure.',
            'Market making': 'Automated market making strategies to provide liquidity and earn trading fees.',
            'Arbitrage opportunities': 'Instantly capitalize on price discrepancies across different exchanges and protocols.',
            'Advanced order types': 'Support for complex order types and trading strategies to maximize profit potential.'
        },
        'Secure Wallet Integration': {
            'Multi-signature support': 'Enhanced security with multi-signature wallet support requiring multiple approvals for transactions.',
            'Hardware wallet integration': 'Seamless integration with popular hardware wallets for maximum security.',
            'Transaction monitoring': 'Real-time monitoring and alerts for all wallet activities and transactions.',
            'Access control': 'Granular access control and permissions management for team-based operations.'
        }
    };
    return descriptions[productTitle]?.[feature] || 'Feature description not available.';
};
const Products = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
    };
    return (_jsxs(Container, { maxWidth: "xl", sx: { py: 8 }, children: [_jsx(Typography, { variant: "h3", component: "h1", gutterBottom: true, align: "center", sx: { mb: 6 }, children: "Our Products" }), _jsx(Grid, { container: true, spacing: 4, children: products.map((product, index) => {
                    const Icon = product.icon;
                    return (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { sx: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out'
                                }
                            }, children: _jsxs(CardContent, { sx: { flexGrow: 1 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(Icon, { sx: { fontSize: 40, mr: 2, color: 'primary.main' } }), _jsx(Typography, { variant: "h5", component: "h2", children: product.title })] }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: product.description }), _jsx(Box, { component: "ul", sx: { pl: 2 }, children: product.features.map((feature, idx) => (_jsx(Typography, { component: "li", variant: "body2", color: "text.secondary", sx: { mb: 1 }, children: feature }, idx))) }), _jsx(Box, { sx: { mt: 2 }, children: _jsx(Button, { variant: "contained", color: "primary", onClick: () => handleOpen(product), sx: {
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&::after': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: '-100%',
                                                    width: '100%',
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                                    animation: 'shimmer 2s infinite',
                                                },
                                                '@keyframes shimmer': {
                                                    '0%': {
                                                        left: '-100%',
                                                    },
                                                    '100%': {
                                                        left: '100%',
                                                    },
                                                },
                                            }, children: "Learn More" }) })] }) }) }, index));
                }) }), _jsx(Dialog, { open: open, onClose: handleClose, maxWidth: "md", fullWidth: true, TransitionComponent: Grow, TransitionProps: { timeout: 300 }, children: selectedProduct && (_jsxs(_Fragment, { children: [_jsxs(DialogTitle, { sx: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                pr: 1
                            }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center' }, children: [_jsx(selectedProduct.icon, { sx: { mr: 2, fontSize: 32 } }), _jsx(Typography, { variant: "h5", children: selectedProduct.title })] }), _jsx(IconButton, { onClick: handleClose, size: "small", children: _jsx(Close, {}) })] }), _jsxs(DialogContent, { dividers: true, children: [_jsx(Typography, { variant: "body1", paragraph: true, children: selectedProduct.description }), _jsx(Typography, { variant: "h6", gutterBottom: true, sx: { mt: 2 }, children: "Key Features" }), _jsx(List, { children: selectedProduct.features.map((feature, idx) => (_jsx(ListItem, { sx: {
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            },
                                        }, children: _jsx(ListItemText, { primary: _jsx(Typography, { variant: "subtitle1", color: "primary", gutterBottom: true, children: feature }), secondary: _jsx(Typography, { variant: "body2", color: "text.secondary", children: getFeatureDescription(selectedProduct.title, feature) }) }) }, idx))) })] }), _jsx(DialogActions, { children: _jsx(Button, { onClick: handleClose, color: "primary", children: "Close" }) })] })) })] }));
};
export default Products;
