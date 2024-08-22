import { useCallback, useEffect, useRef, useState } from 'react';
import {
    useJoinChannelChatMutation,
    useLeaveChannelChatMutation,
    useSendMessageMutation,
    useStartTypingMutation,
    useStopTypingMutation,
    useUpdateDeletedStatusMutation
} from '../../../api/socket-api/socket-api';
import { Message } from '../../../types/messages/Message.types';
import { SocketEvent } from '../../../types/socket/SocketEvent.enum';
import { useChatSocket } from '../../../contexts/ChannelSocketContext';
import {
    useGetMessagesByChannelIdQuery,
    useAddMessageMutation,
    useSwapMessageMutation
} from '../../../api/messages-api/messages-api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { TypingUser } from '../../../types/socket/messages-socket.payload';

export const useChannelSocket = (channelId: string) => {
    const { activeSocket, initializeChannelConnection, terminateChannelConnection } =
        useChatSocket();
    const [joinChannelChat] = useJoinChannelChatMutation();
    const [leaveChannelChat] = useLeaveChannelChatMutation();
    const [sendMessage] = useSendMessageMutation();
    const [updateDeletedStatus] = useUpdateDeletedStatusMutation();
    const [swapMessage] = useSwapMessageMutation();
    const [addMessage] = useAddMessageMutation();
    const [startTyping] = useStartTypingMutation();
    const [stopTyping] = useStopTypingMutation();

    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const currentUser = useSelector((state: RootState) => state.auth.user);

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

        const handleUpdateDeletedStatus = (message: Message) => {
            swapMessage({ channelId, updatedMessage: message });
        };

        const handleTypingUsers = (users: TypingUser[]) => {
            setTypingUsers(users.filter(user => user.id !== currentUser?.id));
        };

        joinChannelChat(channelId);
        activeSocket.on(SocketEvent.NEW_MESSAGE, handleNewMessage);
        activeSocket.on(SocketEvent.UPDATE_DELETED_STATUS, handleUpdateDeletedStatus);
        activeSocket.on(SocketEvent.TYPING_USERS, handleTypingUsers);

        return () => {
            leaveChannelChat(channelIdRef.current);
            activeSocket.off(SocketEvent.NEW_MESSAGE, handleNewMessage);
            activeSocket.off(SocketEvent.UPDATE_DELETED_STATUS, handleUpdateDeletedStatus);
            activeSocket.off(SocketEvent.TYPING_USERS, handleTypingUsers);
        };
    }, [
        activeSocket,
        joinChannelChat,
        leaveChannelChat,
        channelId,
        addMessage,
        swapMessage,
        currentUser
    ]);

    const handleTyping = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        startTyping(channelId);

        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(channelId);
        }, 2000);
    }, [channelId, startTyping, stopTyping]);

    const sendChannelMessage = useCallback(
        (messageContent: string) => {
            if (activeSocket) {
                sendMessage({ channelId: channelIdRef.current, content: messageContent });
                stopTyping(channelIdRef.current);
            }
        },
        [activeSocket, sendMessage, stopTyping]
    );

    const updateMessageDeletedStatus = useCallback(
        (messageId: string, newDeletedStatus: boolean) => {
            if (activeSocket) {
                updateDeletedStatus({
                    channelId: channelIdRef.current,
                    messageId,
                    deletedStatus: newDeletedStatus
                });
            }
        },
        [activeSocket, updateDeletedStatus]
    );

    return {
        channelMessages,
        sendChannelMessage,
        updateMessageDeletedStatus,
        handleTyping,
        typingUsers,
        refetchMessages: refetch
    };
};
