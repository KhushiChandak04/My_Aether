import React from 'react';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Box,
    Button,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Forum,
    School,
    Groups,
    EmojiEvents,
} from '@mui/icons-material';

const communityFeatures = [
    {
        title: 'Trading Forums',
        description: 'Join our vibrant community of traders to discuss strategies, market trends, and trading opportunities.',
        icon: Forum,
        stats: {
            members: '50K+',
            discussions: '10K+',
            dailyActive: '5K+'
        }
    },
    {
        title: 'Learning Hub',
        description: 'Access educational resources, tutorials, and workshops to enhance your trading knowledge.',
        icon: School,
        stats: {
            courses: '100+',
            students: '25K+',
            instructors: '50+'
        }
    },
    {
        title: 'Trading Groups',
        description: 'Join specialized trading groups focused on different strategies and asset classes.',
        icon: Groups,
        stats: {
            groups: '200+',
            members: '30K+',
            activities: '1K+'
        }
    },
    {
        title: 'Trading Competitions',
        description: 'Participate in trading competitions and earn rewards while learning from top traders.',
        icon: EmojiEvents,
        stats: {
            competitions: '50+',
            participants: '15K+',
            prizePools: '$100K+'
        }
    }
];

const topContributors = [
    { name: 'Alex Thompson', role: 'Lead Trader', contributions: 532 },
    { name: 'Sarah Chen', role: 'Strategy Expert', contributions: 423 },
    { name: 'Michael Rodriguez', role: 'Technical Analyst', contributions: 387 },
    { name: 'Emma Watson', role: 'Community Manager', contributions: 356 },
];

const Community: React.FC = () => {
    return (
        <Container maxWidth="xl" sx={{ py: 8 }}>
            <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
                Join Our Community
            </Typography>

            <Grid container spacing={4}>
                {communityFeatures.map((feature, index) => {
                    const Icon = feature.icon;
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
                                            {feature.title}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        {feature.description}
                                    </Typography>

                                    <Grid container spacing={2}>
                                        {Object.entries(feature.stats).map(([key, value]) => (
                                            <Grid item xs={4} key={key}>
                                                <Box sx={{ textAlign: 'center' }}>
                                                    <Typography variant="h6" color="primary">
                                                        {value}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    <Box sx={{ mt: 3 }}>
                                        <Button variant="contained" color="primary" fullWidth>
                                            Join Now
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Top Contributors
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {topContributors.map((contributor, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Avatar 
                                        sx={{ 
                                            width: 80, 
                                            height: 80, 
                                            margin: '0 auto 16px',
                                            bgcolor: 'primary.main'
                                        }}
                                    >
                                        {contributor.name.split(' ').map(n => n[0]).join('')}
                                    </Avatar>
                                    <Typography variant="h6" gutterBottom>
                                        {contributor.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {contributor.role}
                                    </Typography>
                                    <Chip 
                                        label={`${contributor.contributions} Contributions`}
                                        color="primary"
                                        variant="outlined"
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Community;
