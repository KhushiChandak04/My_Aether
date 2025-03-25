import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Grid, Typography, Card, CardContent, Box, Link, Button, } from '@mui/material';
import { MenuBook, VideoLibrary, Article, Code, } from '@mui/icons-material';
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
const Resources = () => {
    return (_jsxs(Container, { maxWidth: "xl", sx: { py: 8 }, children: [_jsx(Typography, { variant: "h3", component: "h1", gutterBottom: true, align: "center", sx: { mb: 6 }, children: "Resources" }), _jsx(Grid, { container: true, spacing: 4, children: resources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { sx: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out'
                                }
                            }, children: _jsxs(CardContent, { sx: { flexGrow: 1 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(Icon, { sx: { fontSize: 40, mr: 2, color: 'primary.main' } }), _jsx(Typography, { variant: "h5", component: "h2", children: resource.title })] }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: resource.description }), _jsx(Box, { sx: { mt: 2 }, children: resource.links.map((link, idx) => (_jsx(Button, { component: Link, href: link.url, color: "primary", sx: {
                                                display: 'block',
                                                textAlign: 'left',
                                                mb: 1,
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }, children: link.title }, idx))) })] }) }) }, index));
                }) })] }));
};
export default Resources;
