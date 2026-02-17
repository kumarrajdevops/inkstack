import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
        background: {
            default: "#f5f5f5",
        }
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }
            }
        }
    }
});

export default theme;
