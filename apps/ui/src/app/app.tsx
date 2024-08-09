import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import SignInPage from './features/login/pages/SignInPage';
import SignUpPage from './features/register/pages/SignUpPage';
import { darkTheme, lightTheme } from './lib/themes';
import SiderbarLayout from './layouts/SidebarLayout';
import ChannelComponent from './features/channels/components/ChannelComponent';
import HomePage from './features/home/pages/HomePage';
import ChannelPage from './features/channels/pages/ChannelPage';

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
                    <Route path="/create-channel" element={<ChannelPage />} />
                    <Route path="/channels/:id" element={<ChannelComponent />} />
                </Route>
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
