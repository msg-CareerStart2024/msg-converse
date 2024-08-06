import { createTheme } from '@mui/material';
import '@fontsource/montserrat';
import '@fontsource/montserrat/700.css';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#A01441'
        },
        secondary: {
            main: '#56A3BC'
        },
        background: {
            default: '#F2F2F2'
        },
        action: {
            hover: '#F6F6F6'
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
            main: '#eb608c'
        },
        secondary: {
            main: '#438fa8'
        },
        background: {
            default: '#0d0d0d'
        },
        action: {
            hover: '#0a0a0a'
        }
    },
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif'
    }
});
