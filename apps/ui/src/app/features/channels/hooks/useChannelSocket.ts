import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useAddMessageMutation,
    useGetMessagesByChannelIdQuery,
    useSwapMessageMutation,
    useUpdateLikeMessageMutation
} from '../../../api/messages-api/messages-api';
import {
    useJoinChannelChatMutation,
    useLeaveChannelChatMutation,
    useSendMessageMutation,
    useStartTypingMutation,
    useStopTypingMutation,
    useToggleLikeMessageMutation,
    useUpdateDeletedStatusMutation
} from '../../../api/socket-api/socket-api';
import { useChatSocket } from '../../../contexts/ChannelSocketContext';
import { RootState } from '../../../store/store';
import { User } from '../../../types/login/User.types';
import { Message } from '../../../types/messages/Message.types';
import { TypingUser } from '../../../types/socket/messages-socket.payload';
import { SocketEvent } from '../../../types/socket/SocketEvent.enum';

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
    const [updateLikeMessage] = useUpdateLikeMessageMutation();
    const [toggleLikeMessage] = useToggleLikeMessageMutation();

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

        const handleUpdateLikeMessage = ({
            user,
            message,
            action
        }: {
            user: User;
            message: Message;
            action: string;
        }) => {
            updateLikeMessage({
                channelId,
                updatedMessage: message,
                user,
                action
            });
        };

        joinChannelChat(channelId);
        activeSocket.on(SocketEvent.NEW_MESSAGE, handleNewMessage);
        activeSocket.on(SocketEvent.UPDATE_DELETED_STATUS, handleUpdateDeletedStatus);
        activeSocket.on(SocketEvent.TYPING_USERS, handleTypingUsers);
        activeSocket.on(SocketEvent.TOGGLE_LIKE_MESSAGE_SERVER, handleUpdateLikeMessage);

        return () => {
            leaveChannelChat(channelIdRef.current);
            activeSocket.off(SocketEvent.NEW_MESSAGE, handleNewMessage);
            activeSocket.off(SocketEvent.UPDATE_DELETED_STATUS, handleUpdateDeletedStatus);
            activeSocket.off(SocketEvent.TYPING_USERS, handleTypingUsers);
            activeSocket.off(SocketEvent.TOGGLE_LIKE_MESSAGE_SERVER, handleUpdateLikeMessage);
        };
    }, [
        activeSocket,
        joinChannelChat,
        leaveChannelChat,
        channelId,
        addMessage,
        swapMessage,
        currentUser,
        updateLikeMessage
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

    const handleToggleLikeMessage = (messageId: string) => {
        if (activeSocket) {
            toggleLikeMessage({ channelId, messageId });
        }
    };

    return {
        channelMessages,
        sendChannelMessage,
        updateMessageDeletedStatus,
        handleTyping,
        typingUsers,
        handleToggleLikeMessage,
        refetchMessages: refetch
    };
};
