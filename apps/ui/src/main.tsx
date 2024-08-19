import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { BrowserRouter } from 'react-router-dom';
import { ChannelSocketProvider } from './app/contexts/ChannelSocketContext';
import { ProtectedRoute } from './app/layouts/ProtectedRoute';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import { store } from './app/store/store';
import React from 'react';

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
