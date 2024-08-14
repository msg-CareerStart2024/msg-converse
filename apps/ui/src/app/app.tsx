import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useLazyGetUserByIdQuery } from './api/users-api/users-api';
import ChannelComponent from './features/channels/components/ChannelComponent';
import ChannelPage from './features/channels/pages/ChannelPage';
import HomePage from './features/home/pages/HomePage';
import SignInPage from './features/login/pages/SignInPage';
import { clearCredentials, setCredentials } from './features/login/slices/auth-slice';
import SignUpPage from './features/register/pages/SignUpPage';
import SiderbarLayout from './layouts/SidebarLayout';
import { darkTheme, lightTheme } from './lib/themes';
import NotFoundPage from './pages/NotFoundPage';
import { RootState, store } from './store/store';
import { DecodedPayload } from './types/login/DecodedPayload.types';
import { decodeToken } from './utils/utils';

export function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const navigate = useNavigate();

    const [getUserById] = useLazyGetUserByIdQuery();
    const user = useSelector((state: RootState) => state.auth.user);
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token && !user) {
            const payload = decodeToken(token);
            if (payload) {
                const fetchUser = async () => {
                    try {
                        const user = await getUserById((payload as DecodedPayload).sub).unwrap();
                        store.dispatch(setCredentials({ user, accessToken: token }));
                    } catch (error) {
                        console.error('Failed to fetch user:', error);
                    }
                };

                fetchUser();
            } else {
                store.dispatch(clearCredentials());
            }
        }
    }, [getUserById, navigate, user]);

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
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
