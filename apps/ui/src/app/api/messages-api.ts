import { createApi } from '@reduxjs/toolkit/query/react';
import { API_CACHE_TAGS } from '../config/api-tags';
import { CreateMessageDTO, Message, UpdateMessageDTO } from '../types/messages/Message';
import getFetchBaseQuery from './fetch-base-query';

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    tagTypes: [API_CACHE_TAGS.MESSAGES],
    baseQuery: getFetchBaseQuery(),
    endpoints: builder => ({
        getMessageByChannel: builder.query<Message[], string>({
            query: channelId => ({
                url: `/${channelId}`
            }),
            providesTags: [API_CACHE_TAGS.MESSAGES]
        }),

        createMessage: builder.mutation<
            Message,
            { channelId: string; messageData: CreateMessageDTO }
        >({
            query: ({ channelId, messageData }) => ({
                url: `/${channelId}`,
                method: 'POST',
                body: messageData
            }),
            invalidatesTags: [API_CACHE_TAGS.MESSAGES]
        }),

        updateMessage: builder.mutation<Message, { id: string; messageData: UpdateMessageDTO }>({
            query: ({ id, messageData }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: messageData
            }),
            invalidatesTags: [API_CACHE_TAGS.MESSAGES]
        }),

        removeMessage: builder.mutation<void, string>({
            query: id => ({
                url: `/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_, error) => (error ? [] : [API_CACHE_TAGS.MESSAGES])
        })
    })
});

export const {
    useGetMessageByChannelQuery,
    useCreateMessageMutation,
    useUpdateMessageMutation,
    useRemoveMessageMutation
} = messagesApi;
