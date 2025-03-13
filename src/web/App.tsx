import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AutoTrading from "./components/AutoTrading";
import CryptoList from "./components/CryptoList";
import MarketUpdate from "./components/MarketUpdate";
import PetraWalletConnect from "./components/PetraWalletConnect";
import TransactionHistory from "./components/TransactionHistory";
import Community from "./pages/Community";
import Products from "./pages/Products";
import Resources from "./pages/Resources";
import Solutions from "./pages/Solutions";
import { PetraProvider } from "./providers/PetraProvider";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3B82F6",
    },
    background: {
      default: "#111827",
      paper: "#1F2937",
    },
  },
});

const navigationItems = [
  { path: "/", label: "Dashboard" },
  { path: "/products", label: "Products" },
  { path: "/solutions", label: "Solutions" },
  { path: "/community", label: "Community" },
  { path: "/resources", label: "Resources" },
];

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
            color: "inherit",
            textDecoration: "none",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <PetraProvider>
        <Router>
          <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <CssBaseline />
            <AppBar position="fixed">
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: "none" } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  AetherAI Trading
                </Typography>
                <Box
                  sx={{ display: { xs: "none", md: "flex" }, gap: 2, mr: 4 }}
                >
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
                <PetraWalletConnect />
              </Toolbar>
            </AppBar>
            {isMobile && mobileOpen && (
              <Box
                component="nav"
                sx={{
                  width: 240,
                  flexShrink: 0,
                  position: "fixed",
                  zIndex: theme.zIndex.appBar - 1,
                  top: 64,
                  bottom: 0,
                  bgcolor: "background.paper",
                  overflowY: "auto",
                }}
              >
                <Navigation />
              </Box>
            )}
            <Container maxWidth="xl" sx={{ mt: 10, mb: 4, width: "100%" }}>
              <Routes>
                <Route
                  path="/"
                  element={
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
                      <Grid item xs={12}>
                        <TransactionHistory />
                      </Grid>
                    </Grid>
                  }
                />
                <Route path="/products" element={<Products />} />
                <Route path="/solutions" element={<Solutions />} />
                <Route path="/community" element={<Community />} />
                <Route path="/resources" element={<Resources />} />
              </Routes>
            </Container>
          </Box>
        </Router>
      </PetraProvider>
    </ThemeProvider>
  );
};

export default App;
