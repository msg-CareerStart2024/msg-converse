import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../api/auth-api';
import { usersApi } from '../api/users-api';
import channelsReducer from '../features/channels/slices/channels-slice';
import authReducer from '../features/login/slices/auth-slice';

export const store = configureStore({
    reducer: {
        channels: channelsReducer,
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(authApi.middleware, usersApi.middleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
