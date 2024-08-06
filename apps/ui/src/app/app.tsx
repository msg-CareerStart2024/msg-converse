import { Route, Routes } from 'react-router-dom';
import { darkTheme, lightTheme } from './lib/themes';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import SignInPage from './features/login/pages/SignInPage';
import SignUpPage from './features/register/pages/SignUpPage';

export function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return (
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Routes>
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
