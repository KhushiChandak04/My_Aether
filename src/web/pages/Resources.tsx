import React from 'react';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Box,
    Link,
    Button,
} from '@mui/material';
import {
    MenuBook,
    VideoLibrary,
    Article,
    Code,
} from '@mui/icons-material';

const resources = [
    {
        title: 'Documentation',
        description: 'Comprehensive guides and API references for AetherAI trading bot.',
        icon: MenuBook,
        links: [
            { title: 'Getting Started', url: '#' },
            { title: 'API Reference', url: '#' },
            { title: 'Trading Strategies', url: '#' },
            { title: 'Best Practices', url: '#' },
        ]
    },
    {
        title: 'Video Tutorials',
        description: 'Learn through step-by-step video tutorials and webinars.',
        icon: VideoLibrary,
        links: [
            { title: 'Bot Setup Guide', url: '#' },
            { title: 'Strategy Development', url: '#' },
            { title: 'Risk Management', url: '#' },
            { title: 'Advanced Features', url: '#' },
        ]
    },
    {
        title: 'Blog & Articles',
        description: 'Latest insights, updates, and trading strategies from our experts.',
        icon: Article,
        links: [
            { title: 'Market Analysis', url: '#' },
            { title: 'Strategy Insights', url: '#' },
            { title: 'Platform Updates', url: '#' },
            { title: 'Success Stories', url: '#' },
        ]
    },
    {
        title: 'Developer Resources',
        description: 'Technical resources, SDKs, and sample code for developers.',
        icon: Code,
        links: [
            { title: 'SDK Documentation', url: '#' },
            { title: 'Sample Projects', url: '#' },
            { title: 'GitHub Repository', url: '#' },
            { title: 'API Playground', url: '#' },
        ]
    }
];

const Resources: React.FC = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
                Resources
            </Typography>

            <Grid container spacing={4}>
                {resources.map((resource, index) => {
                    const Icon = resource.icon;
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
                                            {resource.title}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {resource.description}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        {resource.links.map((link, idx) => (
                                            <Button
                                                key={idx}
                                                component={Link}
                                                href={link.url}
                                                color="primary"
                                                sx={{ 
                                                    display: 'block',
                                                    textAlign: 'left',
                                                    mb: 1,
                                                    '&:hover': {
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                            >
                                                {link.title}
                                            </Button>
                                        ))}
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

export default Resources;
