import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
// import ChannelCard from './features/channels/components/ChannelCard';
// import { CHANNEL } from './features/channels/static';
import { darkTheme, lightTheme } from './lib/themes';
import SignInPage from './features/login/pages/SignInPage';
import SignUpPage from './features/register/pages/SignUpPage';
import ChannelPage from './features/channel/pages/ChannelPage';

export function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return (
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Routes>
                {/* <Route path="/" element={<ChannelCard channel={CHANNEL} />} /> */}
                <Route path="/" element={<ChannelPage />} />
                <Route
                    path="/page-2"
                    element={<Link to="/">Click here to go back to root page.</Link>}
                />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
