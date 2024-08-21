import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetChannelByIdQuery } from '../../../api/channels-api/channels-api';
import { RootState } from '../../../store/store';
import { User } from '../../../types/login/User.types';
import ChannelView from '../components/ChannelView';
import { useChannelSocket } from '../hooks/useChannelSocket';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ChannelChatSchema, ChannelChatValues } from '../schemas/ChatInputValues.schema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ChannelPage() {
    const { id: channelId } = useParams<string>();
    const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

    const {
        channelMessages,
        sendChannelMessage,
        updateMessageDeletedStatus,
        refetchMessages,
        handleTyping,
        typingUsers
    } = useChannelSocket(channelId as string);

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
        async (id: string, isDeleted: boolean) => {
            const newDeletedStatus = !isDeleted;
            updateMessageDeletedStatus(id, newDeletedStatus);
        },
        [updateMessageDeletedStatus]
    );

    return (
        <ChannelView
            channelMessages={channelMessages}
            channel={channel}
            isLoadingChannel={isLoadingChannel}
            errorChannel={errorChannel}
            currentUser={currentUser}
            isOffline={isOffline}
            errors={errors}
            isValid={isValid}
            handleSubmit={handleSubmit}
            register={register}
            sendMessage={sendMessage}
            handleChangeDeletionStatus={handleChangeDeletionStatus}
            typingUsers={typingUsers}
            handleTyping={handleTyping}
        />
    );
}
