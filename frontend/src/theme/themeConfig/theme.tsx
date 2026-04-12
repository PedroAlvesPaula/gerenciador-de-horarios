import { createTheme } from '@mui/material/styles';
import type { Shadows } from '@mui/material/styles';

const defaultTheme = createTheme();

const customShadows = [...defaultTheme.shadows] as Shadows;

customShadows[1] = '0px 2px 4px rgba(0, 0, 0, 0.04)';
customShadows[2] = '0px 4px 8px rgba(0, 0, 0, 0.04)';
customShadows[3] = '0px 8px 16px rgba(0, 0, 0, 0.06)';
customShadows[4] = '0px 12px 24px rgba(0, 0, 0, 0.08)';
customShadows[10] = '0px 24px 48px rgba(0, 0, 0, 0.12)';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3D3021',
            contrastText: '#E5E1D3',
        },
        secondary: {
            main: '#C5A059',
            contrastText: '#3D3021',
        },
        background: {
            default: '#E5E1D3',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#3D3021',
            secondary: '#6b7280',
        },
    },
    shadows: customShadows,
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: '"Lato", "Helvetica", "Arial", sans-serif',
        h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
        h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
        h3: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
        h4: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
        h5: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
        h6: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
        button: {
            fontFamily: '"Lato", sans-serif',
            fontWeight: 700,
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '9999px',
                    padding: '8px 24px',
                },
            },
        },
    },
});

export default theme;