import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Message } from 'react-hook-form';
import { Socket } from 'socket.io-client';

let getSocket: () => Socket | null;
export const injectSocket = (_getSocket: () => Socket | null) => {
    getSocket = _getSocket;
};

export const socketApi = createApi({
    reducerPath: 'socketApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/' }),
    endpoints: builder => ({
        joinChannel: builder.mutation<void, string>({
            queryFn: channelId => {
                const socket = getSocket();
                if (socket) {
                    socket.emit('joinChannel', channelId);
                    return { data: undefined };
                }
                return { error: { status: 'CUSTOM_ERROR', error: 'Socket not connected' } };
            }
        }),
        leaveChannel: builder.mutation<void, string>({
            queryFn: channelId => {
                const socket = getSocket();
                if (socket) {
                    socket.emit('leaveChannel', channelId);
                    return { data: undefined };
                }
                return { error: { status: 'CUSTOM_ERROR', error: 'Socket not connected' } };
            }
        }),
        sendMessage: builder.mutation<void, { channelId: string; content: string }>({
            queryFn: ({ channelId, content }) => {
                const socket = getSocket();
                if (socket) {
                    socket.emit('sendMessage', { channelId, content });
                    return { data: undefined };
                }
                return { error: { status: 'CUSTOM_ERROR', error: 'Socket not connected' } };
            }
        }),
        receiveMessages: builder.query<Message[], string>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(
                channelId,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                const socket = getSocket();
                if (!socket) {
                    return;
                }

                try {
                    await cacheDataLoaded;

                    const handleNewMessage = (message: Message) => {
                        updateCachedData(draft => {
                            draft.push(message);
                        });
                    };

                    socket.on('newMessage', handleNewMessage);

                    socket.emit('getMessages', channelId);

                    await cacheEntryRemoved;

                    socket.off('newMessage', handleNewMessage);
                } catch (error) {
                    console.log('Socket error occured: ' + JSON.stringify(error));
                }
            }
        })
    })
});

export const {
    useJoinChannelMutation,
    useLeaveChannelMutation,
    useSendMessageMutation,
    useReceiveMessagesQuery
} = socketApi;
