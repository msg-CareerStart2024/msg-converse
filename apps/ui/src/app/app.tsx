// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NxWelcome from './nx-welcome';
import { Link, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BASE_URL } from './config/api-config';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { darkTheme, lightTheme } from './lib/themes';

export function App() {
    const [isHealthy, setIsHealthy] = useState(false);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    useEffect(() => {
        const checkHealth = async () => {
            const response = await fetch(`${BASE_URL}/healthcheck`);
            if (response.ok) {
                setIsHealthy(true);
            }
        };

        checkHealth();
    }, []);

    return (
        <ThemeProvider theme={prefersDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <div>
                <NxWelcome title="Msg Converse" isHealthy={isHealthy} />

                {/* START: routes */}
                {/* These routes and navigation have been generated for you */}
                {/* Feel free to move and update them to fit your needs */}
                <br />
                <hr />
                <br />
                <div role="navigation">
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/page-2">Page 2</Link>
                        </li>
                    </ul>
                </div>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div>
                                This is the generated root route.{' '}
                                <Link to="/page-2">Click here for page 2.</Link>
                            </div>
                        }
                    />
                    <Route
                        path="/page-2"
                        element={
                            <div>
                                <Link to="/">Click here to go back to root page.</Link>
                            </div>
                        }
                    />
                </Routes>
                {/* END: routes */}
            </div>
        </ThemeProvider>
    );
}

export default App;
