import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS, BASE_URL } from '../config/api-config';

export const channelsApi = createApi({
    reducerPath: 'channelsApi',
    tagTypes: ['Channels'],
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),
    endpoints: builder => ({
        getChannels: builder.query<void, void>({
            query: () => API_URLS.CHANNELS,
            providesTags: ['Channels']
        }),
        searchChannels: builder.query<void, string>({
            query: keyword => `${API_URLS.CHANNELS}/?s=${encodeURIComponent(keyword)}`,
            providesTags: ['Channels']
        })
    })
});

export const { useGetChannelsQuery, useLazySearchChannelsQuery } = channelsApi;
