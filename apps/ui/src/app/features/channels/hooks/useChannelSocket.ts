import { useEffect, useState } from 'react';
import {
    useJoinChannelChatMutation,
    useLeaveChannelChatMutation
} from '../../../api/socket-api/socket-api';

import { Message } from '../../../types/messages/Message.types';
import { useChatSocket } from '../../../contexts/ChannelSocketContext';

export const useChannelSocket = (channelId: string) => {
    const { activeSocket, initializeChannelConnection, terminateChannelConnection } =
        useChatSocket();
    const [initiateChannelChatJoin] = useJoinChannelChatMutation();
    const [initiateChannelChatLeave] = useLeaveChannelChatMutation();
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

            activeSocket.on('previousMessages', (messages: Message[]) => {
                setChannelMessages(messages);
            });

            activeSocket.on('newMessage', (message: Message) => {
                setChannelMessages(prevMessages => [...prevMessages, message]);
            });

            return () => {
                initiateChannelChatLeave(channelId);
                activeSocket.off('previousMessages');
                activeSocket.off('newMessage');
            };
        }
    }, [channelId, activeSocket, initiateChannelChatJoin, initiateChannelChatLeave]);

    return { channelMessages };
};
