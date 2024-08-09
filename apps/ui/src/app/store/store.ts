import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from '../features/channels/slices/channels-slice';
import { channelsApi } from '../api/channelsApi';

export const store = configureStore({
    reducer: {
        channels: channelsReducer,
        [channelsApi.reducerPath]: channelsApi.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(channelsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
