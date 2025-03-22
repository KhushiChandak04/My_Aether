"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const communityFeatures = [
    {
        title: 'Trading Forums',
        description: 'Join our vibrant community of traders to discuss strategies, market trends, and trading opportunities.',
        icon: icons_material_1.Forum,
        stats: {
            members: '50K+',
            discussions: '10K+',
            dailyActive: '5K+'
        }
    },
    {
        title: 'Learning Hub',
        description: 'Access educational resources, tutorials, and workshops to enhance your trading knowledge.',
        icon: icons_material_1.School,
        stats: {
            courses: '100+',
            students: '25K+',
            instructors: '50+'
        }
    },
    {
        title: 'Trading Groups',
        description: 'Join specialized trading groups focused on different strategies and asset classes.',
        icon: icons_material_1.Groups,
        stats: {
            groups: '200+',
            members: '30K+',
            activities: '1K+'
        }
    },
    {
        title: 'Trading Competitions',
        description: 'Participate in trading competitions and earn rewards while learning from top traders.',
        icon: icons_material_1.EmojiEvents,
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
    return ((0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "xl", sx: { py: 8 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h3", component: "h1", gutterBottom: true, align: "center", sx: { mb: 6 }, children: "Join Our Community" }), (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true, spacing: 4, children: communityFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsx)(material_1.Card, { sx: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out'
                                }
                            }, children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { sx: { flexGrow: 1 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [(0, jsx_runtime_1.jsx)(Icon, { sx: { fontSize: 40, mr: 2, color: 'primary.main' } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", component: "h2", children: feature.title })] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: feature.description }), (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true, spacing: 2, children: Object.entries(feature.stats).map(([key, value]) => ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 4, children: (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", color: "primary", children: value }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", children: key.charAt(0).toUpperCase() + key.slice(1) })] }) }, key))) }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { mt: 3 }, children: (0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", fullWidth: true, children: "Join Now" }) })] }) }) }, index));
                }) }), (0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { mt: 8 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h4", gutterBottom: true, align: "center", children: "Top Contributors" }), (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true, spacing: 3, justifyContent: "center", children: topContributors.map((contributor, index) => ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, sm: 6, md: 3, children: (0, jsx_runtime_1.jsx)(material_1.Card, { children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { sx: { textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)(material_1.Avatar, { sx: {
                                                width: 80,
                                                height: 80,
                                                margin: '0 auto 16px',
                                                bgcolor: 'primary.main'
                                            }, children: contributor.name.split(' ').map(n => n[0]).join('') }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h6", gutterBottom: true, children: contributor.name }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "text.secondary", gutterBottom: true, children: contributor.role }), (0, jsx_runtime_1.jsx)(material_1.Chip, { label: `${contributor.contributions} Contributions`, color: "primary", variant: "outlined" })] }) }) }, index))) })] })] }));
};
exports.default = Community;
