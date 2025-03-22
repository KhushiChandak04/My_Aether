"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const material_1 = require("@mui/material");
const icons_material_1 = require("@mui/icons-material");
const resources = [
    {
        title: 'Documentation',
        description: 'Comprehensive guides and API references for AetherAI trading bot.',
        icon: icons_material_1.MenuBook,
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
        icon: icons_material_1.VideoLibrary,
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
        icon: icons_material_1.Article,
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
        icon: icons_material_1.Code,
        links: [
            { title: 'SDK Documentation', url: '#' },
            { title: 'Sample Projects', url: '#' },
            { title: 'GitHub Repository', url: '#' },
            { title: 'API Playground', url: '#' },
        ]
    }
];
const Resources = () => {
    return ((0, jsx_runtime_1.jsxs)(material_1.Container, { maxWidth: "xl", sx: { py: 8 }, children: [(0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h3", component: "h1", gutterBottom: true, align: "center", sx: { mb: 6 }, children: "Resources" }), (0, jsx_runtime_1.jsx)(material_1.Grid, { container: true, spacing: 4, children: resources.map((resource, index) => {
                    const Icon = resource.icon;
                    return ((0, jsx_runtime_1.jsx)(material_1.Grid, { item: true, xs: 12, md: 6, children: (0, jsx_runtime_1.jsx)(material_1.Card, { sx: {
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'transform 0.3s ease-in-out'
                                }
                            }, children: (0, jsx_runtime_1.jsxs)(material_1.CardContent, { sx: { flexGrow: 1 }, children: [(0, jsx_runtime_1.jsxs)(material_1.Box, { sx: { display: 'flex', alignItems: 'center', mb: 2 }, children: [(0, jsx_runtime_1.jsx)(Icon, { sx: { fontSize: 40, mr: 2, color: 'primary.main' } }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "h5", component: "h2", children: resource.title })] }), (0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: resource.description }), (0, jsx_runtime_1.jsx)(material_1.Box, { sx: { mt: 2 }, children: resource.links.map((link, idx) => ((0, jsx_runtime_1.jsx)(material_1.Button, { component: material_1.Link, href: link.url, color: "primary", sx: {
                                                display: 'block',
                                                textAlign: 'left',
                                                mb: 1,
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }, children: link.title }, idx))) })] }) }) }, index));
                }) })] }));
};
exports.default = Resources;
