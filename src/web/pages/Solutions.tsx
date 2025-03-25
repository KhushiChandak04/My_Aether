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
    Chip
} from '@mui/material';
import { 
    TrendingUp, 
    Analytics, 
    AccountBalanceWallet, 
    Shield,
    Close,
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
        ],
        useCases: [
            'Hedge funds seeking automated DeFi strategies',
            'Individual traders looking for yield optimization',
            'DeFi protocols needing liquidity management',
            'Institutional investors entering DeFi markets'
        ],
        metrics: {
            avgReturn: '15-25% APY',
            gasReduction: 'Up to 40%',
            successRate: '99.9%'
        }
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
        ],
        useCases: [
            'Professional traders requiring real-time insights',
            'Investment firms needing market intelligence',
            'Research analysts conducting market studies',
            'Algorithmic trading systems'
        ],
        metrics: {
            accuracy: '85-95%',
            latency: '<100ms',
            coverage: '100+ chains'
        }
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
        ],
        useCases: [
            'Investment funds managing digital assets',
            'Family offices diversifying into crypto',
            'Corporate treasury management',
            'High net worth individuals'
        ],
        metrics: {
            aum: '$100M+',
            reliability: '99.99%',
            compliance: '100%'
        }
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
        ],
        useCases: [
            'Cryptocurrency exchanges',
            'DeFi protocols',
            'Institutional custodians',
            'Enterprise blockchain solutions'
        ],
        metrics: {
            security: 'Military-grade',
            uptime: '99.999%',
            insurance: 'Up to $100M'
        }
    }
];

const getBenefitDescription = (solutionTitle: string, benefit: string): string => {
    const descriptions: { [key: string]: { [key: string]: string } } = {
        'DeFi Trading': {
            'Automated yield farming': 'Smart algorithms continuously monitor and optimize yield farming positions across multiple protocols to maximize returns while minimizing risks.',
            'Cross-chain trading': 'Seamlessly execute trades across different blockchain networks with automated bridging and best price routing.',
            'Impermanent loss protection': 'Advanced strategies and hedging mechanisms to minimize impermanent loss in liquidity provision.',
            'Gas optimization': 'Intelligent transaction timing and routing to minimize gas costs while maintaining execution efficiency.'
        },
        'Market Analysis': {
            'Market sentiment analysis': 'Real-time analysis of social media, news, and on-chain metrics to gauge market sentiment and predict price movements.',
            'Technical indicators': 'Comprehensive suite of technical indicators with AI-enhanced signal generation for better trading decisions.',
            'Price prediction models': 'Machine learning models trained on historical data and market patterns to forecast price movements with high accuracy.',
            'Trading signals': 'Automated generation of trading signals based on multiple data points and proven strategies.'
        },
        'Asset Management': {
            'Portfolio rebalancing': 'Automated portfolio rebalancing based on predefined strategies and market conditions to maintain optimal asset allocation.',
            'Risk management': 'Sophisticated risk assessment and management tools to protect assets and optimize returns.',
            'Performance tracking': 'Real-time monitoring and detailed reporting of portfolio performance across all assets and strategies.',
            'Tax reporting': 'Automated tax reporting and documentation for crypto transactions across multiple jurisdictions.'
        },
        'Security Solutions': {
            'Multi-signature wallets': 'Enterprise-grade multi-signature wallet implementation with customizable approval workflows and role-based access.',
            'Cold storage': 'Secure cold storage solutions with institutional-grade security measures and backup procedures.',
            'Audit trails': 'Comprehensive logging and audit trails for all transactions and system access.',
            'Access control': 'Granular access control with multi-factor authentication and role-based permissions.'
        }
    };
    return descriptions[solutionTitle]?.[benefit] || 'Benefit description not available.';
};

const Solutions: React.FC = () => {
    const [selectedSolution, setSelectedSolution] = useState<typeof solutions[0] | null>(null);
    const [open, setOpen] = useState(false);

    const handleOpen = (solution: typeof solutions[0]) => {
        setSelectedSolution(solution);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => setSelectedSolution(null), 300);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
                Our Solutions
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

                                    <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
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
                                        <Button 
                                            variant="contained" 
                                            color="primary"
                                            onClick={() => handleOpen(solution)}
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
                {selectedSolution && (
                    <>
                        <DialogTitle sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            pr: 1
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <selectedSolution.icon sx={{ mr: 2, fontSize: 32 }} />
                                <Typography variant="h5">{selectedSolution.title}</Typography>
                            </Box>
                            <IconButton onClick={handleClose} size="small">
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography variant="body1" paragraph>
                                {selectedSolution.description}
                            </Typography>

                            {/* Key Metrics Section */}
                            <Box sx={{ mb: 4, mt: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    Key Metrics
                                </Typography>
                                <Grid container spacing={2}>
                                    {Object.entries(selectedSolution.metrics).map(([key, value]) => (
                                        <Grid item xs={12} sm={4} key={key}>
                                            <Card>
                                                <CardContent>
                                                    <Typography variant="subtitle2" color="primary">
                                                        {key.toUpperCase()}
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {value}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            {/* Benefits Section */}
                            <Typography variant="h6" gutterBottom>
                                Detailed Benefits
                            </Typography>
                            <List>
                                {selectedSolution.benefits.map((benefit, idx) => (
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
                                                    {benefit}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary">
                                                    {getBenefitDescription(selectedSolution.title, benefit)}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            {/* Use Cases Section */}
                            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                                Use Cases
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedSolution.useCases.map((useCase, idx) => (
                                    <Chip
                                        key={idx}
                                        label={useCase}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ 
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': { 
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                transform: 'translateY(-1px)'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
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

export default Solutions;
