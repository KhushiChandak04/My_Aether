import React from 'react';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Box,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { Check } from '@mui/icons-material';

const plans = [
    {
        name: 'Basic',
        price: '$49',
        period: 'per month',
        description: 'Perfect for beginners and small traders',
        features: [
            'Basic trading strategies',
            'Market data access',
            'Manual trading execution',
            'Basic analytics',
            'Email support'
        ],
        buttonText: 'Start Free Trial',
        highlighted: false
    },
    {
        name: 'Pro',
        price: '$99',
        period: 'per month',
        description: 'For serious traders and professionals',
        features: [
            'Advanced trading strategies',
            'Real-time market data',
            'Automated trading execution',
            'Advanced analytics',
            'Priority support',
            'API access',
            'Custom indicators'
        ],
        buttonText: 'Get Started',
        highlighted: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: 'contact us',
        description: 'For institutions and large-scale operations',
        features: [
            'Custom trading strategies',
            'Institutional-grade data',
            'High-frequency trading',
            'Custom analytics',
            'Dedicated support team',
            'Full API access',
            'Custom development',
            'SLA guarantee'
        ],
        buttonText: 'Contact Sales',
        highlighted: false
    }
];

const Pricing: React.FC = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
                Pricing Plans
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
                Choose the perfect plan for your trading needs
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {plans.map((plan, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                ...(plan.highlighted && {
                                    border: 2,
                                    borderColor: 'primary.main',
                                    transform: 'scale(1.05)',
                                }),
                                '&:hover': {
                                    transform: plan.highlighted ? 'scale(1.05)' : 'scale(1.02)',
                                    transition: 'transform 0.3s ease-in-out'
                                }
                            }}
                        >
                            {plan.highlighted && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 20,
                                        right: -32,
                                        transform: 'rotate(45deg)',
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        px: 4,
                                        py: 0.5,
                                    }}
                                >
                                    Popular
                                </Box>
                            )}
                            <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                <Typography variant="h4" component="h2" gutterBottom>
                                    {plan.name}
                                </Typography>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h3" component="p">
                                        {plan.price}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        {plan.period}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" color="text.secondary" paragraph>
                                    {plan.description}
                                </Typography>
                                <List sx={{ mb: 4 }}>
                                    {plan.features.map((feature, idx) => (
                                        <ListItem key={idx} sx={{ px: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <Check color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary={feature} />
                                        </ListItem>
                                    ))}
                                </List>
                                <Button
                                    variant={plan.highlighted ? 'contained' : 'outlined'}
                                    color="primary"
                                    size="large"
                                    fullWidth
                                >
                                    {plan.buttonText}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                    Need a custom solution?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Contact our sales team for a customized plan that fits your specific requirements.
                </Typography>
                <Button variant="outlined" color="primary" size="large">
                    Contact Sales
                </Button>
            </Box>
        </Container>
    );
};

export default Pricing;
