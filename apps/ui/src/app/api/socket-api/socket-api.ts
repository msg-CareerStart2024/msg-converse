import { FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
    PinMessageEventPayload,
    SendMessageEventPayload
} from '../../types/socket/messages-socket.payload';
import { Socket } from 'socket.io-client';
import { SocketErrorMessage } from '../../types/socket/SocketErrorMessage.enum';
import { SocketErrorType } from '../../types/socket/SocketErrorType.enum';
import { SocketEvent } from '../../types/socket/SocketEvent.enum';

type SocketGetter = () => Socket | null;

let getActiveSocket: SocketGetter;

export const registerSocketInstance = (socketGetter: SocketGetter) => {
    getActiveSocket = socketGetter;
};

const emitSocketEvent = <T>(event: SocketEvent, payload?: T) => {
    const activeSocket = getActiveSocket();
    if (activeSocket) {
        activeSocket.emit(event, payload);
        return { data: undefined };
    }
    return {
        error: {
            status: SocketErrorType.CUSTOM_ERROR,
            data: SocketErrorMessage.NO_ACTIVE_SOCKET
        } as FetchBaseQueryError
    };
};

export const socketApi = createApi({
    reducerPath: 'socketApi',
    baseQuery: fetchBaseQuery(),
    endpoints: builder => ({
        joinChannelChat: builder.mutation<void, string>({
            queryFn: channelId => emitSocketEvent(SocketEvent.JOIN_CHANNEL_CHAT, channelId)
        }),
        leaveChannelChat: builder.mutation<void, string>({
            queryFn: channelId => emitSocketEvent(SocketEvent.LEAVE_CHANNEL_CHAT, channelId)
        }),
        sendMessage: builder.mutation<void, SendMessageEventPayload>({
            queryFn: payload => emitSocketEvent(SocketEvent.SEND_MESSAGE, payload)
        }),
        pinMessage: builder.mutation<void, PinMessageEventPayload>({
            queryFn: payload => emitSocketEvent(SocketEvent.PIN_FROM_CLIENT, payload)
        })
    })
});

export const {
    useJoinChannelChatMutation,
    useLeaveChannelChatMutation,
    useSendMessageMutation,
    usePinMessageMutation
} = socketApi;
