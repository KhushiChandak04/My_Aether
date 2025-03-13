import React from 'react';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Box,
    Button,
} from '@mui/material';
import { 
    TrendingUp, 
    Analytics, 
    AccountBalanceWallet, 
    Shield
} from '@mui/icons-material';

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

const Solutions: React.FC = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
                Solutions
            </Typography>

            <Grid container spacing={4}>
                {solutions.map((solution, index) => {
                    const Icon = solution.icon;
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
                                            {solution.title}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {solution.description}
                                    </Typography>

                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Key Benefits
                                    </Typography>

                                    <Box component="ul" sx={{ pl: 2 }}>
                                        {solution.benefits.map((benefit, idx) => (
                                            <Typography 
                                                key={idx} 
                                                component="li" 
                                                variant="body2" 
                                                color="text.secondary"
                                                sx={{ mb: 1 }}
                                            >
                                                {benefit}
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

export default Solutions;
