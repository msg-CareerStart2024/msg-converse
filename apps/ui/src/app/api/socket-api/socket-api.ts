import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Socket } from 'socket.io-client';
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
                return { error: { status: 'CUSTOM_ERROR', error: 'No active socket connection' } };
            }
        }),
        leaveChannelChat: builder.mutation<void, string>({
            queryFn: channelId => {
                const activeSocket = getActiveSocket();
                if (activeSocket) {
                    activeSocket.emit(SocketEvent.LEAVE_CHANNEL_CHAT, channelId);
                    return { data: undefined };
                }
                return { error: { status: 'CUSTOM_ERROR', error: 'No active socket connection' } };
            }
        })
    })
});

export const { useJoinChannelChatMutation, useLeaveChannelChatMutation } = socketApi;
