import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Message } from '../../types/messages/Message.types';
import { Socket } from 'socket.io-client';
import { SocketErrorMessage } from '../../types/socket/SocketErrorMessage.enum';
import { SocketErrorType } from '../../types/socket/SocketErrorType.enum';
import { SocketEvent } from '../../types/socket/SocketEvent.enum';

let getActiveSocket: () => Socket | null;
export const registerSocketInstance = (_getActiveSocket: () => Socket | null) => {
    getActiveSocket = _getActiveSocket;
};

export const socketApi = createApi({
    reducerPath: 'socketApi',
    baseQuery: fetchBaseQuery(),
    endpoints: builder => ({
        joinChannelChat: builder.mutation<void, string>({
            queryFn: channelId => {
                const activeSocket = getActiveSocket();
                if (activeSocket) {
                    activeSocket.emit(SocketEvent.JOIN_CHANNEL_CHAT, channelId);
                    return { data: undefined };
                }
                return {
                    error: {
                        status: SocketErrorType.CUSTOM_ERROR,
                        error: SocketErrorMessage.NO_ACTIVE_SOCKET
                    }
                };
            }
        }),
        leaveChannelChat: builder.mutation<void, string>({
            queryFn: channelId => {
                const activeSocket = getActiveSocket();
                if (activeSocket) {
                    activeSocket.emit(SocketEvent.LEAVE_CHANNEL_CHAT, channelId);
                    return { data: undefined };
                }
                return {
                    error: {
                        status: SocketErrorType.CUSTOM_ERROR,
                        error: SocketErrorMessage.NO_ACTIVE_SOCKET
                    }
                };
            }
        }),
        sendMessage: builder.mutation<void, { channelId: string; content: string }>({
            queryFn: ({ channelId, content }) => {
                const activeSocket = getActiveSocket();
                if (activeSocket) {
                    activeSocket.emit(SocketEvent.SEND_MESSAGE, { channelId, content });
                    return { data: undefined };
                }
                return {
                    error: {
                        status: SocketErrorType.CUSTOM_ERROR,
                        error: SocketErrorMessage.NO_ACTIVE_SOCKET
                    }
                };
            }
        }),
        receiveMessages: builder.query<Message[], string>({
            queryFn: () => ({ data: [] }),
            async onCacheEntryAdded(
                channelId,
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
            ) {
                const activeSocket = getActiveSocket();
                if (!activeSocket) return;

                try {
                    await cacheDataLoaded;

                    const handleIncomingMessage = (message: Message) => {
                        updateCachedData(draft => {
                            const existingMessageIndex = draft.findIndex(m => m.id === message.id);
                            if (existingMessageIndex !== -1) {
                                draft[existingMessageIndex] = message;
                            } else {
                                draft.push(message);
                            }
                        });
                    };

                    const handlePreviousMessages = (messages: Message[]) => {
                        updateCachedData(() => messages);
                    };

                    activeSocket.on(SocketEvent.NEW_MESSAGE, handleIncomingMessage);
                    activeSocket.on(SocketEvent.PREVIOUS_MESSAGES, handlePreviousMessages);

                    await cacheEntryRemoved;

                    activeSocket.off(SocketEvent.NEW_MESSAGE, handleIncomingMessage);
                    activeSocket.off(SocketEvent.PREVIOUS_MESSAGES, handlePreviousMessages);
                } catch (error) {
                    console.error('Socket communication error:', error);
                }
            }
        })
    })
});

export const {
    useJoinChannelChatMutation,
    useLeaveChannelChatMutation,
    useSendMessageMutation,
    useReceiveMessagesQuery
} = socketApi;
