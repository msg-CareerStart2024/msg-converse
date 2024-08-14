import { authApi } from '../api/auth-api';
import authReducer from '../features/login/slices/auth-slice';
import { channelsApi } from '../api/channels-api';
import { configureStore } from '@reduxjs/toolkit';
import { messagesApi } from '../api/messages-api';
import { setupListeners } from '@reduxjs/toolkit/query';
import { usersApi } from '../api/users-api';
import { messagesApi } from '../api/messages-api';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [channelsApi.reducerPath]: channelsApi.reducer,
        [messagesApi.reducerPath]: messagesApi.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            usersApi.middleware,
            channelsApi.middleware,
            messagesApi.middleware
        )
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
