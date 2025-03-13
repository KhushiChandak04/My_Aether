import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    IconButton,
    ThemeProvider,
    Toolbar,
    Typography,
    createTheme,
    useMediaQuery,
    Container,
    Button,
    List,
    ListItem,
    ListItemText,
    useTheme,
    Grid,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import MarketUpdate from './components/MarketUpdate';
import CryptoList from './components/CryptoList';
import AutoTrading from './components/AutoTrading';
import Products from './pages/Products';
import Solutions from './pages/Solutions';
import Community from './pages/Community';
import Resources from './pages/Resources';
import Pricing from './pages/Pricing';
import WalletConnect from './components/WalletConnect';
import { Web3Provider } from './providers/Web3Provider';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3B82F6',
        },
        background: {
            default: '#111827',
            paper: '#1F2937',
        },
    },
});

const navigationItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/community', label: 'Community' },
    { path: '/resources', label: 'Resources' },
    { path: '/pricing', label: 'Pricing' },
];

const App: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const Navigation = () => (
        <List>
            {navigationItems.map((item) => (
                <ListItem 
                    key={item.path} 
                    component={Link} 
                    to={item.path}
                    sx={{ 
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': {
                            bgcolor: 'action.hover'
                        }
                    }}
                >
                    <ListItemText primary={item.label} />
                </ListItem>
            ))}
        </List>
    );

    return (
        <ThemeProvider theme={darkTheme}>
            <Web3Provider>
                <Router>
                    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                        <CssBaseline />
                        <AppBar position="fixed">
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 2, display: { sm: 'none' } }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                                    AetherAI Trading
                                </Typography>
                                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, mr: 4 }}>
                                    {navigationItems.map((item) => (
                                        <Button
                                            key={item.path}
                                            component={Link}
                                            to={item.path}
                                            color="inherit"
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </Box>
                                <WalletConnect />
                            </Toolbar>
                        </AppBar>
                        {isMobile && mobileOpen && (
                            <Box
                                component="nav"
                                sx={{
                                    width: 240,
                                    flexShrink: 0,
                                    position: 'fixed',
                                    zIndex: theme.zIndex.appBar - 1,
                                    top: 64,
                                    bottom: 0,
                                    bgcolor: 'background.paper',
                                    overflowY: 'auto',
                                }}
                            >
                                <Navigation />
                            </Box>
                        )}
                        <Container maxWidth="xl" sx={{ mt: 10, mb: 4, width: '100%' }}>
                            <Routes>
                                <Route path="/" element={
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} lg={8}>
                                            <MarketUpdate />
                                        </Grid>
                                        <Grid item xs={12} lg={4}>
                                            <CryptoList />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <AutoTrading />
                                        </Grid>
                                    </Grid>
                                } />
                                <Route path="/products" element={<Products />} />
                                <Route path="/solutions" element={<Solutions />} />
                                <Route path="/community" element={<Community />} />
                                <Route path="/resources" element={<Resources />} />
                                <Route path="/pricing" element={<Pricing />} />
                            </Routes>
                        </Container>
                    </Box>
                </Router>
            </Web3Provider>
        </ThemeProvider>
    );
};

export default App;