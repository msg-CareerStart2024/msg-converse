import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { store } from './app/store/store';
import React from 'react';
import { ProtectedRoute } from './app/layouts/ProtectedRoute';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ProtectedRoute>
                    <App />
                </ProtectedRoute>
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
