import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Grid, Typography, Card, CardContent, Box, Button, Avatar, Chip, } from '@mui/material';
import { Forum, School, Groups, EmojiEvents, } from '@mui/icons-material';
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
const Community = () => {
    return (_jsxs(Container, { maxWidth: "xl", sx: { py: 8 }, children: [_jsx(Typography, { variant: "h3", component: "h1", gutterBottom: true, align: "center", sx: { mb: 6 }, children: "Join Our Community" }), _jsx(Grid, { container: true, spacing: 4, children: communityFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { sx: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out'
                                }
                            }, children: _jsxs(CardContent, { sx: { flexGrow: 1 }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [_jsx(Icon, { sx: { fontSize: 40, mr: 2, color: 'primary.main' } }), _jsx(Typography, { variant: "h5", component: "h2", children: feature.title })] }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: feature.description }), _jsx(Grid, { container: true, spacing: 2, children: Object.entries(feature.stats).map(([key, value]) => (_jsx(Grid, { item: true, xs: 4, children: _jsxs(Box, { sx: { textAlign: 'center' }, children: [_jsx(Typography, { variant: "h6", color: "primary", children: value }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: key.charAt(0).toUpperCase() + key.slice(1) })] }) }, key))) }), _jsx(Box, { sx: { mt: 3 }, children: _jsx(Button, { variant: "contained", color: "primary", fullWidth: true, children: "Join Now" }) })] }) }) }, index));
                }) }), _jsxs(Box, { sx: { mt: 8 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, align: "center", children: "Top Contributors" }), _jsx(Grid, { container: true, spacing: 3, justifyContent: "center", children: topContributors.map((contributor, index) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { children: _jsxs(CardContent, { sx: { textAlign: 'center' }, children: [_jsx(Avatar, { sx: {
                                                width: 80,
                                                height: 80,
                                                margin: '0 auto 16px',
                                                bgcolor: 'primary.main'
                                            }, children: contributor.name.split(' ').map(n => n[0]).join('') }), _jsx(Typography, { variant: "h6", gutterBottom: true, children: contributor.name }), _jsx(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: contributor.role }), _jsx(Chip, { label: `${contributor.contributions} Contributions`, color: "primary", variant: "outlined" })] }) }) }, index))) })] })] }));
};
export default Community;
