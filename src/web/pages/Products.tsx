import React, { useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Grow,
} from '@mui/material';
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

const getFeatureDescription = (productTitle: string, feature: string): string => {
    const descriptions: { [key: string]: { [key: string]: string } } = {
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

const Products: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
    const [open, setOpen] = useState(false);

    const handleOpen = (product: typeof products[0]) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => setSelectedProduct(null), 300);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
                Our Products
            </Typography>

            <Grid container spacing={4}>
                {products.map((product, index) => {
                    const Icon = product.icon;
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        transition: 'transform 0.3s ease-in-out'
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Icon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                                        <Typography variant="h5" component="h2">
                                            {product.title}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {product.description}
                                    </Typography>

                                    <Box component="ul" sx={{ pl: 2 }}>
                                        {product.features.map((feature, idx) => (
                                            <Typography 
                                                key={idx} 
                                                component="li" 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ mb: 1 }}
                                            >
                                                {feature}
                                            </Typography>
                                        ))}
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => handleOpen(product)}
                                            sx={{
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
                                            }}
                                        >
                                            Learn More
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                TransitionComponent={Grow}
                TransitionProps={{ timeout: 300 }}
            >
                {selectedProduct && (
                    <>
                        <DialogTitle sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            pr: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <selectedProduct.icon sx={{ mr: 2, fontSize: 32 }} />
                                <Typography variant="h5">{selectedProduct.title}</Typography>
                            </Box>
                            <IconButton onClick={handleClose} size="small">
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography variant="body1" paragraph>
                                {selectedProduct.description}
                            </Typography>

                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Key Features
                            </Typography>
                            <List>
                                {selectedProduct.features.map((feature, idx) => (
                                    <ListItem key={idx} sx={{
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        },
                                    }}>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" color="primary" gutterBottom>
                                                    {feature}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {getFeatureDescription(selectedProduct.title, feature)}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
};

export default Products;
