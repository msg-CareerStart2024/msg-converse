import { useCallback, useEffect } from 'react';
import {
    useJoinChannelMutation,
    useLeaveChannelMutation,
    useReceiveMessagesQuery,
    useSendMessageMutation
} from '../../../api/socket-api/socket-api';

import { useSocket } from '../../../contexts/SocketContext';

export const useChannelSocket = (channelId: string) => {
    const { socket, connectToChannel, disconnectFromChannel } = useSocket();
    const [joinChannel] = useJoinChannelMutation();
    const [leaveChannel] = useLeaveChannelMutation();
    const [sendMessage] = useSendMessageMutation();
    const { data: messages = [] } = useReceiveMessagesQuery(channelId, {
        skip: !socket
    });

    useEffect(() => {
        connectToChannel(channelId);
        if (socket) {
            joinChannel(channelId);
        }
        return () => {
            if (socket) {
                leaveChannel(channelId);
            }
            disconnectFromChannel();
        };
    }, [channelId, socket, connectToChannel, disconnectFromChannel, joinChannel, leaveChannel]);

    const sendMessageHandler = useCallback(
        (content: string) => {
            if (socket) {
                sendMessage({ channelId, content });
            }
        },
        [channelId, sendMessage, socket]
    );

    return { messages, sendMessage: sendMessageHandler };
};
