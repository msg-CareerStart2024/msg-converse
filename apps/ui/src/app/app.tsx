import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useLazyGetUserByIdQuery } from './api/users-api';
import ChannelComponent from './features/channels/components/ChannelComponent';
import HomePage from './features/home/pages/HomePage';
import SignInPage from './features/login/pages/SignInPage';
import { setCredentials } from './features/login/slices/auth-slice';
import SignUpPage from './features/register/pages/SignUpPage';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import SiderbarLayout from './layouts/SidebarLayout';
import { darkTheme, lightTheme } from './lib/themes';
import NotFoundPage from './pages/NotFoundPage';
import { RootState, store } from './store/store';
import { DecodedPayload } from './types/login/DecodedPayload';
import { decodeToken } from './utils/utils';
import ChannelPage from './features/channels/pages/ChannelPage';

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
                    <Route path="/channels">
                        <Route path="new" element={<ChannelPage />} />
                        <Route path="edit/:id" element={<ChannelPage />} />
                        <Route path=":id" element={<ChannelComponent />} />
                    </Route>
                </Route>
                <Route
                    path="/login"
                    element={
                        <ProtectedRoute>
                            <SignInPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <ProtectedRoute>
                            <SignUpPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
