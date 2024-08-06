import { Route, Routes } from 'react-router-dom';
import { darkTheme, lightTheme } from './lib/themes';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import SignInContainer from './features/login/pages/SignInContainer';

export function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    return (
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <Routes>
                <Route path="/login" element={<SignInContainer />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
