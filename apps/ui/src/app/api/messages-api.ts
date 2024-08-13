import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CACHE_TAGS } from '../config/api-tags';
import { API_URLS, BASE_URL } from '../config/api-config';
import { CreateMessageDTO, Message, UpdateMessageDTO } from '../types/messages/Message';
import { addBearerAuthHeader } from '../utils/utils';

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    tagTypes: [API_CACHE_TAGS.MESSAGES],
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL + API_URLS.MESSAGES,
        prepareHeaders: addBearerAuthHeader
    }),
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
            invalidatesTags: [API_CACHE_TAGS.MESSAGES]
        })
    })
});

export const {
    useGetMessageByChannelQuery,
    useCreateMessageMutation,
    useUpdateMessageMutation,
    useRemoveMessageMutation
} = messagesApi;
