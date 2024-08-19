import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../../config/api-config';
import { API_CACHE_TAGS } from '../../config/api-tags';
import { Channel, ChannelDTO } from '../../types/channel/channel.types';
import getFetchBaseQuery from '../fetch-base-query';

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

        joinChannel: builder.mutation<void, string>({
            query: id => ({
                url: `${id}/join`,
                method: 'PUT'
            }),
            invalidatesTags: (_, error) => (error ? [] : [API_CACHE_TAGS.JOINED_CHANNELS])
        }),
        leaveChannel: builder.mutation<void, string>({
            query: id => ({
                url: `${id}/leave`,
                method: 'PUT'
            }),
            invalidatesTags: (_, error) => (error ? [] : [API_CACHE_TAGS.JOINED_CHANNELS])
        }),
        createChannel: builder.mutation<Channel, ChannelDTO>({
            query: channel => ({
                url: '',
                method: 'POST',
                body: channel
            }),
            invalidatesTags: (_, error) => (error ? [] : [API_CACHE_TAGS.CHANNELS])
        }),
        updateChannel: builder.mutation<Channel, { id: string; partialChannel: ChannelDTO }>({
            query: ({ id, partialChannel }) => ({
                url: `${id}`,
                method: 'PUT',
                body: partialChannel
            }),
            invalidatesTags: (_, error) => (error ? [] : [API_CACHE_TAGS.CHANNELS])
        }),

        deleteChannel: builder.mutation<void, string>({
            query: id => ({
                url: `${id}`,
                method: 'DELETE'
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
    useLeaveChannelMutation,
    useLazyGetChannelByIdQuery,
    useCreateChannelMutation,
    useDeleteChannelMutation,
    useUpdateChannelMutation,
    useGetChannelByIdQuery
} = channelsApi;
