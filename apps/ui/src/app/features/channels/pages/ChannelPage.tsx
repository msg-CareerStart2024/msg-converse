import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetChannelByIdQuery } from '../../../api/channels-api/channels-api';
import { useUpdateMessageMutation } from '../../../api/messages-api/messages-api';
import { RootState } from '../../../store/store';
import { User } from '../../../types/login/User.types';
import { Message } from '../../../types/messages/Message.types';
import ChannelView from '../components/ChannelView';
import { useChannelSocket } from '../hooks/useChannelSocket';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ChannelChatSchema, ChannelChatValues } from '../schemas/ChatInputValues.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ChannelPage() {
    const { id: channelId } = useParams<string>();
    const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

    const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
    const popoverOpen = Boolean(popoverAnchor);

    const {
        channelMessages,
        sendChannelMessage,
        refetchMessages,
        handleTyping,
        typingUsers,
        pinChannelMessage
    } = useChannelSocket(channelId as string);
    const [updateMessage] = useUpdateMessageMutation();

    const {
        data: channel,
        isLoading: isLoadingChannel,
        error: errorChannel
    } = useGetChannelByIdQuery(channelId as string);

    const currentUser: User = useSelector((state: RootState) => state.auth.user) as User;

    const handleOnlineStatus = useCallback(() => {
        setIsOffline(!navigator.onLine);
        if (navigator.onLine) {
            refetchMessages();
        }
    }, [refetchMessages]);

    useEffect(() => {
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, [handleOnlineStatus]);

    const {
        handleSubmit,
        register,
        getValues,
        reset,
        formState: { errors, isValid }
    } = useForm<ChannelChatValues>({
        resolver: zodResolver(ChannelChatSchema),
        mode: 'onChange'
    });

    const sendMessage: SubmitHandler<ChannelChatValues> = useCallback(async () => {
        const message = getValues('message');
        if (message.trim()) {
            sendChannelMessage(message);
            reset();
        }
    }, [getValues, sendChannelMessage, reset]);

    const handleChangeDeletionStatus = useCallback(
        async (id: string, messageData: Omit<Message, 'id' | 'content' | 'createdAt' | 'user'>) => {
            const { isDeleted } = messageData;
            messageData.isDeleted = !isDeleted;
            messageData.isPinned = false;
            await updateMessage({ id, messageData });
        },
        [updateMessage]
    );

    const handlePinStatus = (messageId: string, pinStatus: boolean) => {
        if (channelId) pinChannelMessage(channelId, messageId, pinStatus);
    };

    return (
        <ChannelView
            channelMessages={channelMessages}
            channel={channel}
            isLoadingChannel={isLoadingChannel}
            errorChannel={errorChannel}
            currentUser={currentUser}
            isOffline={isOffline}
            popoverOpen={popoverOpen}
            popoverAnchor={popoverAnchor}
            setPopoverAnchor={setPopoverAnchor}
            sendMessage={sendMessage}
            handleChangeDeletionStatus={handleChangeDeletionStatus}
            handlePinStatus={handlePinStatus}
            errors={errors}
            isValid={isValid}
            handleSubmit={handleSubmit}
            register={register}
            typingUsers={typingUsers}
            handleTyping={handleTyping}
        />
    );
}
