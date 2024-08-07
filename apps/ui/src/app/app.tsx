import { Route, Routes } from 'react-router-dom';
import { darkTheme, lightTheme } from './lib/themes';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import SignInPage from './features/login/pages/SignInPage';
import SiderbarLayout from './layouts/SidebarLayout';

export function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return (
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Routes>
                <Route element={<SiderbarLayout />}>
                    <Route path="/" element={<p>Random page go brr!</p>} />
                </Route>
                <Route path="/login" element={<SignInPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
