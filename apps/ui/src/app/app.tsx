import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { RootState, store } from './store/store';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { clearCredentials, setCredentials } from './features/login/slices/auth-slice';
import { darkTheme, lightTheme } from './lib/themes';

import ChannelComponent from './features/channels/components/ChannelComponent';
import ChannelPage from './features/channels/pages/ChannelPage';
import { DecodedPayload } from './types/login/DecodedPayload.types';
import HomePage from './features/home/pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import SiderbarLayout from './layouts/SidebarLayout';
import SignInPage from './features/login/pages/SignInPage';
import SignUpPage from './features/register/pages/SignUpPage';
import { decodeToken } from './utils/utils';
import { useEffect } from 'react';
import { useLazyGetUserByIdQuery } from './api/users-api/users-api';
import { useSelector } from 'react-redux';

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
                <Route element={<SiderbarLayout />} />
                <Route element={<SiderbarLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/channels">
                        <Route path="new" element={<ChannelPage />} />
                        <Route path="edit/:id" element={<ChannelPage />} />

                        <Route path=":id" element={<ChannelComponent />} />
                    </Route>
                </Route>
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
