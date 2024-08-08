import '@fontsource/montserrat';
import '@fontsource/montserrat/700.css';
import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
    interface Theme {
        customShadows: {
            light: string;
            medium: string;
            heavy: string;
        };
    }
    interface ThemeOptions {
        customShadows?: {
            light?: string;
            medium?: string;
            heavy?: string;
        };
    }
}

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
        },
        text: {
            primary: '#000000',
            secondary: '#757575',
            disabled: '#BDBDBD'
        }
    },
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif'
    },
    customShadows: {
        light: '0px 0px 10px #00000029'
    }
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#A01441'
        },
        secondary: {
            main: '#438fa8'
        },
        background: {
            default: '#0d0d0d',
            paper: '#363636'
        },
        action: {
            hover: '#0a0a0a'
        },
        text: {
            primary: '#ffffff',
            secondary: '#B0B0B0',
            disabled: '#757575'
        }
    },
    typography: {
        fontFamily: 'Montserrat, Arial, sans-serif'
    }
});
