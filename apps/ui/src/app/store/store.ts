import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authApi } from '../api/auth-api/auth-api';
import authReducer from '../features/login/slices/auth-slice';
import { channelsApi } from '../api/channels-api/channels-api';
import { messagesApi } from '../api/messages-api/messages-api';
import { setupListeners } from '@reduxjs/toolkit/query';
import { socketApi } from '../api/socket-api/socket-api';
import { usersApi } from '../api/users-api/users-api';

const rootReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [socketApi.reducerPath]: socketApi.reducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            usersApi.middleware,
            channelsApi.middleware,
            messagesApi.middleware,
            socketApi.middleware
        )
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware().concat(
                authApi.middleware,
                usersApi.middleware,
                channelsApi.middleware,
                messagesApi.middleware,
                socketApi.middleware
            ),
        preloadedState
    });
};

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
