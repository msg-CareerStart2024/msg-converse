import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import SignUpPage from './features/register/pages/SignUpPage';
import { darkTheme, lightTheme } from './lib/themes';
import SiderbarLayout from './layouts/SidebarLayout';
import ChannelComponent from './features/channels/components/ChannelComponent';
import HomePage from './features/home/pages/HomePage';
import ChannelPage from './features/channel/pages/ChannelPage';

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
                    <Route path="/channels">
                        <Route path="new" element={<ChannelPage isEdit={false} />} />
                        <Route path=":id" element={<ChannelComponent />} />
                        <Route path=":id/edit" element={<ChannelPage isEdit={true} />} />
                    </Route>
                </Route>
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
