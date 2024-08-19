import { addNewMessage, setPreviousMessages } from '../slices/channel-messages-slice';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useJoinChannelChatMutation,
    useLeaveChannelChatMutation,
    useSendMessageMutation
} from '../../../api/socket-api/socket-api';

import { Message } from '../../../types/messages/Message.types';
import { RootState } from '../../../store/store';
import { SocketEvent } from '../../../types/socket/SocketEvent.enum';
import { useChatSocket } from '../../../contexts/ChannelSocketContext';

export const useChannelSocket = (channelId: string) => {
    const dispatch = useDispatch();
    const { activeSocket, initializeChannelConnection, terminateChannelConnection } =
        useChatSocket();
    const [joinChannelChat] = useJoinChannelChatMutation();
    const [leaveChannelChat] = useLeaveChannelChatMutation();
    const [sendMessage] = useSendMessageMutation();

    const channelMessages = useSelector(
        (state: RootState) => state.channelMessages[channelId] || []
    );

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
            dispatch(setPreviousMessages({ channelId, messages }));
        };

        const handleNewMessage = (message: Message) => {
            dispatch(addNewMessage({ channelId, message }));
        };

        joinChannelChat(channelId);
        activeSocket.on(SocketEvent.PREVIOUS_MESSAGES, handlePreviousMessages);
        activeSocket.on(SocketEvent.NEW_MESSAGE, handleNewMessage);

        return () => {
            leaveChannelChat(channelIdRef.current);
            activeSocket.off(SocketEvent.PREVIOUS_MESSAGES, handlePreviousMessages);
            activeSocket.off(SocketEvent.NEW_MESSAGE, handleNewMessage);
        };
    }, [activeSocket, joinChannelChat, leaveChannelChat, channelId, dispatch]);

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
