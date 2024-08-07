import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import { darkTheme, lightTheme } from './lib/themes';
import SignInPage from './features/login/pages/SignInPage';
import SiderbarLayout from './layouts/SidebarLayout';
import SignUpPage from './features/register/pages/SignUpPage';
import HomePage from './features/home/pages/HomePage';

export function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return (
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />

            <Routes>
                <Route element={<SiderbarLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/page-2"
                        element={<Link to="/">Click here to go back to root page.</Link>}
                    />
                </Route>
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
