import { useCallback, useEffect, useState } from 'react';
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
    const [initiateChannelChatJoin] = useJoinChannelChatMutation();
    const [initiateChannelChatLeave] = useLeaveChannelChatMutation();
    const [dispatchMessage] = useSendMessageMutation();
    const [channelMessages, setChannelMessages] = useState<Message[]>([]);

    useEffect(() => {
        initializeChannelConnection(channelId);

        return () => {
            terminateChannelConnection();
        };
    }, [channelId, initializeChannelConnection, terminateChannelConnection]);

    useEffect(() => {
        if (activeSocket) {
            initiateChannelChatJoin(channelId);

            activeSocket.on(SocketEvent.PREVIOUS_MESSAGES, (messages: Message[]) => {
                setChannelMessages(messages);
            });

            activeSocket.on(SocketEvent.NEW_MESSAGE, (message: Message) => {
                setChannelMessages(prevMessages => [...prevMessages, message]);
            });

            return () => {
                initiateChannelChatLeave(channelId);
                activeSocket.off(SocketEvent.PREVIOUS_MESSAGES);
                activeSocket.off(SocketEvent.NEW_MESSAGE);
            };
        }
    }, [channelId, activeSocket, initiateChannelChatJoin, initiateChannelChatLeave]);

    const sendChannelMessage = useCallback(
        (messageContent: string) => {
            if (activeSocket) {
                dispatchMessage({ channelId, content: messageContent });
            }
        },
        [channelId, dispatchMessage, activeSocket]
    );

    return { channelMessages, sendChannelMessage };
};
