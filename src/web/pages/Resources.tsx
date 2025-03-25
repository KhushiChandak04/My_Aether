import React from 'react';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Box,
    CardMedia,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    MenuBook,
    VideoLibrary,
    Article,
    Code,
    PlayArrow,
    OpenInNew,
} from '@mui/icons-material';

const resources = [
    {
        title: 'Documentation',
        description: 'Comprehensive guides and API references for AetherAI trading bot.',
        icon: MenuBook,
        links: [
            { 
                title: 'Getting Started', 
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=PHe0bXAIuk0',
                thumbnail: 'https://img.youtube.com/vi/PHe0bXAIuk0/maxresdefault.jpg',
                description: 'How The Economic Machine Works - A comprehensive guide to financial markets'
            },
            {
                title: 'Trading Basics',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8',
                thumbnail: 'https://img.youtube.com/vi/ZCFkWDdmXG8/maxresdefault.jpg',
                description: 'The Ultimate Guide to Trading Fundamentals'
            },
            {
                title: 'Market Analysis',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=Vn9_aZgENI8',
                thumbnail: 'https://img.youtube.com/vi/Vn9_aZgENI8/maxresdefault.jpg',
                description: 'Understanding Market Analysis and Trends'
            },
            {
                title: 'Risk Management',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=uMZxd7n3y3c',
                thumbnail: 'https://img.youtube.com/vi/uMZxd7n3y3c/maxresdefault.jpg',
                description: 'Essential Risk Management Strategies'
            }
        ]
    },
    {
        title: 'Video Tutorials',
        description: 'Learn through step-by-step video tutorials and webinars.',
        icon: VideoLibrary,
        links: [
            { 
                title: 'Trading Fundamentals', 
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=Kl4-VJ2K8Ik',
                thumbnail: 'https://img.youtube.com/vi/Kl4-VJ2K8Ik/maxresdefault.jpg',
                description: 'Understanding Trading Fundamentals & Technical Analysis'
            },
            {
                title: 'Technical Analysis',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=eynxyoKgpng',
                thumbnail: 'https://img.youtube.com/vi/eynxyoKgpng/maxresdefault.jpg',
                description: 'Master Technical Analysis Patterns'
            },
            {
                title: 'Chart Patterns',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=QFu9EXJ89l8',
                thumbnail: 'https://img.youtube.com/vi/QFu9EXJ89l8/maxresdefault.jpg',
                description: 'Essential Chart Patterns for Trading'
            },
            {
                title: 'Trading Psychology',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=XBcRLTJZXGk',
                thumbnail: 'https://img.youtube.com/vi/XBcRLTJZXGk/maxresdefault.jpg',
                description: 'Understanding Trading Psychology'
            }
        ]
    },
    {
        title: 'Blog & Articles',
        description: 'Latest insights, updates, and trading strategies from our experts.',
        icon: Article,
        links: [
            { 
                title: 'Market Analysis', 
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=WEDIj9JBTC8',
                thumbnail: 'https://img.youtube.com/vi/WEDIj9JBTC8/maxresdefault.jpg',
                description: 'Professional Guide to Technical Analysis'
            },
            {
                title: 'Trading Strategies',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=yWAFIj9LYh8',
                thumbnail: 'https://img.youtube.com/vi/yWAFIj9LYh8/maxresdefault.jpg',
                description: 'Advanced Trading Strategies Explained'
            },
            {
                title: 'Market Psychology',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=TBFqxGHO_ro',
                thumbnail: 'https://img.youtube.com/vi/TBFqxGHO_ro/maxresdefault.jpg',
                description: 'Understanding Market Psychology'
            },
            {
                title: 'Risk Assessment',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=8AJps5T9FrM',
                thumbnail: 'https://img.youtube.com/vi/8AJps5T9FrM/maxresdefault.jpg',
                description: 'Professional Risk Assessment Techniques'
            }
        ]
    },
    {
        title: 'Developer Resources',
        description: 'Technical resources, SDKs, and sample code for developers.',
        icon: Code,
        links: [
            { 
                title: 'Trading Bot Development', 
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=xGr0n7EjwLY',
                thumbnail: 'https://img.youtube.com/vi/xGr0n7EjwLY/maxresdefault.jpg',
                description: 'Building Trading Bots with Python'
            },
            {
                title: 'Algorithmic Trading',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=x2HbXnwAYXQ',
                thumbnail: 'https://img.youtube.com/vi/x2HbXnwAYXQ/maxresdefault.jpg',
                description: 'Introduction to Algorithmic Trading'
            },
            {
                title: 'Python for Finance',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=2BrpKpWwT2A',
                thumbnail: 'https://img.youtube.com/vi/2BrpKpWwT2A/maxresdefault.jpg',
                description: 'Python Programming for Finance'
            },
            {
                title: 'API Integration',
                url: '#',
                videoUrl: 'https://www.youtube.com/watch?v=9gEPiIoAHo8',
                thumbnail: 'https://img.youtube.com/vi/9gEPiIoAHo8/maxresdefault.jpg',
                description: 'Trading API Integration Guide'
            }
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
                                            <Box key={idx} sx={{ mb: 3 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle1" color="primary">
                                                        {link.title}
                                                    </Typography>
                                                    <Box sx={{ flexGrow: 1 }} />
                                                    <Tooltip title="Watch Tutorial">
                                                        <IconButton 
                                                            color="primary" 
                                                            component="a" 
                                                            href={link.videoUrl} 
                                                            target="_blank"
                                                            size="small"
                                                        >
                                                            <PlayArrow />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Open Documentation">
                                                        <IconButton 
                                                            color="primary" 
                                                            component="a" 
                                                            href={link.url} 
                                                            target="_blank"
                                                            size="small"
                                                        >
                                                            <OpenInNew />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                                <Card 
                                                    sx={{ 
                                                        position: 'relative',
                                                        cursor: 'pointer',
                                                        '&:hover .playOverlay': {
                                                            opacity: 1
                                                        }
                                                    }}
                                                    component="a"
                                                    href={link.videoUrl}
                                                    target="_blank"
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={link.thumbnail}
                                                        alt={link.title}
                                                    />
                                                    <Box 
                                                        className="playOverlay"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: 'rgba(0,0,0,0.5)',
                                                            opacity: 0,
                                                            transition: 'opacity 0.2s',
                                                        }}
                                                    >
                                                        <PlayArrow sx={{ fontSize: 48, color: 'white' }} />
                                                    </Box>
                                                </Card>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                    {link.description}
                                                </Typography>
                                            </Box>
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
