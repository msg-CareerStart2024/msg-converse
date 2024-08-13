import { API_CACHE_TAGS } from '../config/api-tags';
import { API_URLS } from '../config/api-config';
import { Channel } from '../types/channels/Channel';
import { createApi } from '@reduxjs/toolkit/query/react';
import getFetchBaseQuery from './fetch-base-query';

export const channelsApi = createApi({
    reducerPath: 'channelsApi',
    tagTypes: [API_CACHE_TAGS.CHANNELS],
    baseQuery: getFetchBaseQuery(API_URLS.CHANNELS),
    endpoints: builder => ({
        getChannels: builder.query<Channel[], string>({
            query: keyword => `?searchKey=${encodeURIComponent(keyword)}`,
            providesTags: [API_CACHE_TAGS.CHANNELS]
        }),

        getJoinedChannels: builder.query<Channel[], void>({
            query: () => 'joined',
            providesTags: [API_CACHE_TAGS.JOINED_CHANNELS]
        }),

        getChannelById: builder.query<Channel, string>({
            query: id => `${id}`
        }),

        joinChannel: builder.mutation<void, { user: string; channel: string }>({
            query: data => ({
                url: 'join',
                method: 'POST',
                body: { user: data.user, channel: data.channel }
            }),
            invalidatesTags: (_, error) =>
                error ? [] : [API_CACHE_TAGS.CHANNELS, API_CACHE_TAGS.JOINED_CHANNELS]
        })
    })
});

export const {
    useLazyGetChannelsQuery,
    useGetChannelsQuery,
    useGetJoinedChannelsQuery,
    useJoinChannelMutation,
    useGetChannelByIdQuery
} = channelsApi;
