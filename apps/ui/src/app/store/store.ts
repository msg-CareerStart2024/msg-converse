import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../api/auth/auth-api';
import { channelsApi } from '../api/channels-api/channelsApi';
import { messagesApi } from '../api/messages-api';
import { usersApi } from '../api/users-api/users-api';
import authReducer from '../features/login/slices/auth-slice';

const rootReducer = combineReducers({
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer
});
export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            usersApi.middleware,
            channelsApi.middleware,
            messagesApi.middleware
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
                messagesApi.middleware
            ),
        preloadedState
    });
};

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
