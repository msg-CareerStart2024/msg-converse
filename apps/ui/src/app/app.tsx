import { Route, Routes } from 'react-router-dom';
import Login from './features/login/pages/Login';
import { darkTheme, lightTheme } from './lib/themes';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import Signup from './features/login/pages/Signup';

export function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return (
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
