import * as ReactDOM from 'react-dom/client';

import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { ChannelSocketProvider } from './app/contexts/ChannelSocketContext';
import { ProtectedRoute } from './app/layouts/ProtectedRoute';
import { store } from './app/store/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <StrictMode>
        <Provider store={store}>
            <ChannelSocketProvider>
                <BrowserRouter>
                    <ProtectedRoute>
                        <App />
                    </ProtectedRoute>
                </BrowserRouter>
            </ChannelSocketProvider>
        </Provider>
    </StrictMode>
);
