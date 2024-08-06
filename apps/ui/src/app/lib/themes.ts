import { createTheme } from '@mui/material';
import '@fontsource/montserrat';
import '@fontsource/montserrat/700.css';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2'
        },
        secondary: {
            main: '#1B1B1B'
        },
        background: {
            default: '#ffffff',
            paper: '#f5f5f5'
        }
    },
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif'
    }
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2081E2'
        },
        secondary: {
            main: '#1B1B1B'
        },
        background: {
            default: '#121212',
            paper: '#202020'
        }
    },
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif'
    }
});
