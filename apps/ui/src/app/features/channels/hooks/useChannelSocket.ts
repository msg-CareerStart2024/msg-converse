import { useCallback, useEffect, useRef, useState } from 'react';
import {
    useJoinChannelChatMutation,
    useLeaveChannelChatMutation,
    useSendMessageMutation
} from '../../../api/socket-api/socket-api';

import { Message } from '../../../types/messages/Message.types';
import { SocketEvent } from '../../../types/socket/SocketEvent.enum';
import { useChatSocket } from '../../../contexts/ChannelSocketContext';

export const useChannelSocket = (channelId: string) => {
    const { activeSocket, initializeChannelConnection, terminateChannelConnection } =
        useChatSocket();
    const [joinChannelChat] = useJoinChannelChatMutation();
    const [leaveChannelChat] = useLeaveChannelChatMutation();
    const [sendMessage] = useSendMessageMutation();
    const [channelMessages, setChannelMessages] = useState<Message[]>([]);

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

        const handlePreviousMessages = (messages: Message[]) => {
            setChannelMessages(messages);
        };

        const handleNewMessage = (message: Message) => {
            setChannelMessages(prevMessages => [...prevMessages, message]);
        };

        joinChannelChat(channelId);
        activeSocket.on(SocketEvent.PREVIOUS_MESSAGES, handlePreviousMessages);
        activeSocket.on(SocketEvent.NEW_MESSAGE, handleNewMessage);

        return () => {
            leaveChannelChat(channelIdRef.current);
            activeSocket.off(SocketEvent.PREVIOUS_MESSAGES, handlePreviousMessages);
            activeSocket.off(SocketEvent.NEW_MESSAGE, handleNewMessage);
        };
    }, [activeSocket, joinChannelChat, leaveChannelChat, channelId]);

    const sendChannelMessage = useCallback(
        (messageContent: string) => {
            if (activeSocket) {
                sendMessage({ channelId: channelIdRef.current, content: messageContent });
            }
        },
        [activeSocket, sendMessage]
    );

    return { channelMessages, sendChannelMessage };
};
