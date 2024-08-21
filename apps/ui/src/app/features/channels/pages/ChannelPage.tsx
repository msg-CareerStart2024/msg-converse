import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetChannelByIdQuery } from '../../../api/channels-api/channels-api';
import { useUpdateMessageMutation } from '../../../api/messages-api/messages-api';
import { RootState } from '../../../store/store';
import { User } from '../../../types/login/User.types';
import { Message } from '../../../types/messages/Message.types';
import ChannelView from '../components/ChannelView';
import { useChannelSocket } from '../hooks/useChannelSocket';

export default function ChannelPage() {
    const { id: channelId } = useParams<string>();
    const [writtenMessage, setWrittenMessage] = useState<string>('');
    const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

    const { channelMessages, sendChannelMessage, refetchMessages } = useChannelSocket(
        channelId as string
    );
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

    const sendMessage = useCallback(
        async (event?: FormEvent<HTMLFormElement>) => {
            if (event) {
                event.preventDefault();
            }

            if (writtenMessage.trim()) {
                await sendChannelMessage(writtenMessage);
                setWrittenMessage('');
            }
        },
        [writtenMessage, sendChannelMessage]
    );

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWrittenMessage(event.target.value);
    };

    const handleChangeDeletionStatus = useCallback(
        async (id: string, messageData: Omit<Message, 'id' | 'content' | 'createdAt' | 'user'>) => {
            const { isDeleted } = messageData;
            messageData.isDeleted = !isDeleted;
            messageData.isPinned = false;
            await updateMessage({ id, messageData });
        },
        [updateMessage]
    );

    const handleChangePinStatus = useCallback(
        async (id: string, messageData: Omit<Message, 'id' | 'content' | 'createdAt' | 'user'>) => {
            const { isPinned } = messageData;
            messageData.isPinned = !isPinned;
            await updateMessage({ id, messageData });
        },
        [updateMessage]
    );

    return (
        <ChannelView
            channelMessages={channelMessages}
            channel={channel}
            isLoadingChannel={isLoadingChannel}
            errorChannel={errorChannel}
            currentUser={currentUser}
            writtenMessage={writtenMessage}
            isOffline={isOffline}
            handleMessageChange={handleMessageChange}
            sendMessage={sendMessage}
            handleChangeDeletionStatus={handleChangeDeletionStatus}
            handleChangePinStatus={handleChangePinStatus}
        />
    );
}
