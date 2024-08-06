import { Route, Routes } from 'react-router-dom';
import Login from './features/login/pages/Login';
import { darkTheme, lightTheme } from './lib/themes';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';

export function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return (
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
