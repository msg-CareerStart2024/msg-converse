import { createApi } from '@reduxjs/toolkit/query/react';
import { API_URLS } from '../config/api-config';
import { setChannels } from '../features/channels/slices/channels-slice';
import { Channel } from '../types/channels/Channel';
import { API_CACHE_TAGS } from '../config/api-tags';
import getFetchBaseQuery from './fetch-base-query';

export const channelsApi = createApi({
    reducerPath: 'channelsApi',
    tagTypes: [API_CACHE_TAGS.CHANNELS],
    baseQuery: getFetchBaseQuery(),
    endpoints: builder => ({
        getChannels: builder.query<Channel[], string>({
            query: keyword => `${API_URLS.CHANNELS}/?searchKey=${encodeURIComponent(keyword)}`,
            providesTags: [API_CACHE_TAGS.CHANNELS],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setChannels(data));
                } catch (error) {
                    alert('Searching channels failed');
                }
            }
        }),

        getChannelById: builder.query<Channel, string>({
            query: id => `${API_URLS.CHANNELS}/${id}`
        }),

        joinChannel: builder.mutation<void, { user: string; channel: string }>({
            query: data => ({
                url: `${API_URLS.CHANNELS}/join`,
                method: 'POST',
                body: { user: data.user, channel: data.channel }
            }),
            invalidatesTags: [API_CACHE_TAGS.CHANNELS]
        })
    })
});

export const {
    useLazyGetChannelsQuery,
    useGetChannelsQuery,
    useJoinChannelMutation,
    useGetChannelByIdQuery
} = channelsApi;
