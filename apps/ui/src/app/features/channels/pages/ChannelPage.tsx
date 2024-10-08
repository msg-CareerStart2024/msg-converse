import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetChannelByIdQuery } from '../../../api/channels-api/channels-api';
import { RootState } from '../../../store/store';
import { User } from '../../../types/login/User.types';
import ChannelView from '../components/ChannelView';
import { useChannelSocket } from '../hooks/useChannelSocket';
import { ChannelChatSchema, ChannelChatValues } from '../schemas/ChatInputValues.schema';

export default function ChannelPage() {
    const { id: channelId } = useParams<string>();
    const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

    const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
    const popoverOpen = Boolean(popoverAnchor);

    const {
        channelMessages,
        sendChannelMessage,
        updateMessageDeletedStatus,
        refetchMessages,
        handleTyping,
        typingUsers,
        handleToggleLikeMessage,
        pinChannelMessage
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

    const sendMessage: SubmitHandler<ChannelChatValues> = () => {
        const message = getValues('message');
        if (message.trim()) {
            sendChannelMessage(message);
            reset();
        }
    };

    const handleChangeDeletionStatus = (id: string, isDeleted: boolean) => {
        const newDeletedStatus = !isDeleted;
        updateMessageDeletedStatus(id, newDeletedStatus);
    };

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
            handleToggleLikeMessage={handleToggleLikeMessage}
        />
    );
}
