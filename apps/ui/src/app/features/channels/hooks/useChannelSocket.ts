import { useCallback, useEffect, useRef } from 'react';
import {
    useJoinChannelChatMutation,
    useLeaveChannelChatMutation,
    usePinMessageMutation,
    useSendMessageMutation
} from '../../../api/socket-api/socket-api';
import { Message } from '../../../types/messages/Message.types';
import { SocketEvent } from '../../../types/socket/SocketEvent.enum';
import { useChatSocket } from '../../../contexts/ChannelSocketContext';
import {
    useGetMessagesByChannelIdQuery,
    useAddMessageMutation,
    useSwapMessageMutation
} from '../../../api/messages-api/messages-api';

export const useChannelSocket = (channelId: string) => {
    const { activeSocket, initializeChannelConnection, terminateChannelConnection } =
        useChatSocket();
    const [joinChannelChat] = useJoinChannelChatMutation();
    const [leaveChannelChat] = useLeaveChannelChatMutation();
    const [sendMessage] = useSendMessageMutation();
    const [addMessage] = useAddMessageMutation();
    const [pinMessage] = usePinMessageMutation();
    const [swapMessage] = useSwapMessageMutation();

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

        const handlePinMessage = (message: Message) => {
            swapMessage({ channelId, updatedMessage: message });
        };

        joinChannelChat(channelId);
        activeSocket.on(SocketEvent.NEW_MESSAGE, handleNewMessage);
        activeSocket.on(SocketEvent.PIN_FROM_SERVER, handlePinMessage);

        return () => {
            leaveChannelChat(channelIdRef.current);
            activeSocket.off(SocketEvent.NEW_MESSAGE, handleNewMessage);
        };
    }, [activeSocket, joinChannelChat, leaveChannelChat, channelId, addMessage, swapMessage]);

    const sendChannelMessage = useCallback(
        (messageContent: string) => {
            if (activeSocket) {
                sendMessage({ channelId: channelIdRef.current, content: messageContent });
            }
        },
        [activeSocket, sendMessage]
    );

    const pinChannelMessage = useCallback(
        (channelId: string, messageId: string, pinStatus: boolean) => {
            if (activeSocket) {
                pinMessage({ channelId, messageId, pinStatus });
            }
        },
        [activeSocket, pinMessage]
    );

    return { channelMessages, sendChannelMessage, refetchMessages: refetch, pinChannelMessage };
};
