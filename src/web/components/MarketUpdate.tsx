import {
  Refresh,
  Star,
  StarBorder,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
}

const formatPrice = (price: number): string => {
  if (price >= 1000000000) {
    return `$${(price / 1000000000).toFixed(2)}B`;
  }
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`;
  }
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(2)}K`;
  }
  return `$${price.toFixed(2)}`;
};

const formatPriceChange = (change: number | null | undefined): string => {
  if (change == null) return 'N/A';
  return change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
};

const MarketUpdate: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 seconds

  const fetchCryptoData = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      
      const response = await fetch("http://localhost:4000/api/market/crypto", {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch crypto data: ${response.status}`);
      }

      const data = await response.json();
      setCryptoData(data);
      setLastUpdated(new Date());
      setError(null);
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchCryptoData(true), RETRY_DELAY);
        setError(`Retrying to fetch market data... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      } else {
        setError("Failed to fetch market data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(() => fetchCryptoData(), 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setRetryCount(0);
    fetchCryptoData();
  };

  if (loading && !cryptoData.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Market Update</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          <IconButton 
            onClick={handleRefresh} 
            size="small"
            disabled={loading}
          >
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity={retryCount < MAX_RETRIES ? "info" : "error"} 
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={30}>#</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">24h %</TableCell>
              <TableCell align="right">Market Cap</TableCell>
              <TableCell align="right">24h Chart</TableCell>
              <TableCell width={50}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cryptoData.map((crypto) => (
              <TableRow
                key={crypto.id}
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <TableCell>{crypto.market_cap_rank}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      style={{ width: 24, height: 24 }}
                    />
                    <Box>
                      <Typography variant="body2">{crypto.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {crypto.symbol.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatPrice(crypto.current_price)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    icon={
                      crypto.price_change_percentage_24h > 0 ? (
                        <TrendingUp />
                      ) : (
                        <TrendingDown />
                      )
                    }
                    label={formatPriceChange(
                      crypto.price_change_percentage_24h
                    )}
                    size="small"
                    color={
                      crypto.price_change_percentage_24h > 0
                        ? "success"
                        : "error"
                    }
                  />
                </TableCell>
                <TableCell align="right">
                  {formatPrice(crypto.market_cap)}
                </TableCell>
                <TableCell align="right" sx={{ width: 200 }}>
                  {crypto.sparkline_in_7d && (
                    <ResponsiveContainer width="100%" height={50}>
                      <AreaChart data={crypto.sparkline_in_7d.price.map((price, i) => ({ price, i }))}>
                        <defs>
                          <linearGradient id={`gradient-${crypto.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor={crypto.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336"}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={crypto.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336"}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={crypto.price_change_percentage_24h > 0 ? "#4caf50" : "#f44336"}
                          fill={`url(#gradient-${crypto.id})`}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => toggleFavorite(crypto.id)}
                  >
                    {favorites.includes(crypto.id) ? (
                      <Star sx={{ color: "warning.main" }} />
                    ) : (
                      <StarBorder />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MarketUpdate;
