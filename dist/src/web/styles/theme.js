import { createTheme } from '@mui/material/styles';
export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366F1',
            light: '#818CF8',
            dark: '#4F46E5',
        },
        secondary: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
        },
        background: {
            default: '#0B1120',
            paper: '#1E293B',
        },
        text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
        },
        success: {
            main: '#10B981',
            light: '#34D399',
            dark: '#059669',
        },
        error: {
            main: '#EF4444',
            light: '#F87171',
            dark: '#DC2626',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 12,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                },
            },
        },
    },
});
