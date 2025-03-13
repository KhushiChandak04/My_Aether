import React from 'react';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
} from '@mui/material';
import { AutoGraph, AccountBalance, Speed, Security } from '@mui/icons-material';

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

const Products: React.FC = () => {
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
                                        <Button variant="contained" color="primary">
                                            Learn More
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default Products;
