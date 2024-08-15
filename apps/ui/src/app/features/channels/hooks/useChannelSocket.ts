import { useCallback, useEffect } from 'react';
import {
    useJoinChannelMutation,
    useLeaveChannelMutation,
    useReceiveMessagesQuery,
    useSendMessageMutation
} from '../../../api/socket-api/socket-api';

import { useSocket } from '../../../contexts/SocketContext';

export const useChannelSocket = (channelId: string) => {
    const { socket } = useSocket();
    const [joinChannel] = useJoinChannelMutation();
    const [leaveChannel] = useLeaveChannelMutation();
    const [sendMessage] = useSendMessageMutation();
    const { data: messages = [] } = useReceiveMessagesQuery(channelId);

    useEffect(() => {
        if (socket && channelId) {
            joinChannel(channelId);
            return () => {
                leaveChannel(channelId);
            };
        }
    }, [socket, channelId, joinChannel, leaveChannel]);

    const sendMessageHandler = useCallback(
        (content: string) => {
            sendMessage({ channelId, content });
        },
        [channelId, sendMessage]
    );

    return { messages, sendMessage: sendMessageHandler };
};
