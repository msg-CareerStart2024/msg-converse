import { useCallback, useEffect, useRef } from 'react';
import {
    useJoinChannelChatMutation,
    useLeaveChannelChatMutation,
    useSendMessageMutation
} from '../../../api/socket-api/socket-api';
import { Message } from '../../../types/messages/Message.types';
import { SocketEvent } from '../../../types/socket/SocketEvent.enum';
import { useChatSocket } from '../../../contexts/ChannelSocketContext';
import {
    useGetMessagesByChannelIdQuery,
    useAddMessageMutation
} from '../../../api/messages-api/messages-api';

export const useChannelSocket = (channelId: string) => {
    const { activeSocket, initializeChannelConnection, terminateChannelConnection } =
        useChatSocket();
    const [joinChannelChat] = useJoinChannelChatMutation();
    const [leaveChannelChat] = useLeaveChannelChatMutation();
    const [sendMessage] = useSendMessageMutation();
    const [addMessage] = useAddMessageMutation();

    const { data: channelMessages, refetch } = useGetMessagesByChannelIdQuery(channelId);

    const channelIdRef = useRef(channelId);

    useEffect(() => {
        channelIdRef.current = channelId;
    }, [channelId]);

    useEffect(() => {
        initializeChannelConnection(channelId);
        return terminateChannelConnection;
    }, [channelId, initializeChannelConnection, terminateChannelConnection]);

    useEffect(() => {
        if (!activeSocket) return;

        const handleNewMessage = (message: Message) => {
            addMessage({ channelId, message });
        };

        joinChannelChat(channelId);
        activeSocket.on(SocketEvent.NEW_MESSAGE, handleNewMessage);

        return () => {
            leaveChannelChat(channelIdRef.current);
            activeSocket.off(SocketEvent.NEW_MESSAGE, handleNewMessage);
        };
    }, [activeSocket, joinChannelChat, leaveChannelChat, channelId, addMessage]);

    const sendChannelMessage = useCallback(
        (messageContent: string) => {
            if (activeSocket) {
                sendMessage({ channelId: channelIdRef.current, content: messageContent });
            }
        },
        [activeSocket, sendMessage]
    );

    return { channelMessages, sendChannelMessage, refetchMessages: refetch };
};
