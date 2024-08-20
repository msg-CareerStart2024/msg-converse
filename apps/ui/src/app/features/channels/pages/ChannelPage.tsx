import { FormEvent, useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetChannelByIdQuery } from '../../../api/channels-api/channels-api';
import {
    useCreateMessageMutation,
    useGetMessagesByChannelIdQuery,
    useUpdateMessageMutation
} from '../../../api/messages-api/messages-api';
import { RootState } from '../../../store/store';
import { User } from '../../../types/login/User.types';
import { Message } from '../../../types/messages/Message.types';
import ChannelView from '../components/ChannelView';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

export default function ChannelPage() {
    const { id: channelId } = useParams<string>();
    const [writtenMessage, setWrittenMessage] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        data: messages,
        isLoading: isLoadingMessages,
        error: errorMessages
    } = useGetMessagesByChannelIdQuery(channelId as string);
    const [createMessage] = useCreateMessageMutation();
    const [updateMessage] = useUpdateMessageMutation();

    const {
        data: channel,
        isLoading: isLoadingChannel,
        error: errorChannel
    } = useGetChannelByIdQuery(channelId as string);

    const currentUser: User = useSelector((state: RootState) => state.auth.user) as User;

    const sendMessage = useCallback(
        async (event?: FormEvent<HTMLFormElement>) => {
            if (event) {
                event.preventDefault();
            }

            if (writtenMessage) {
                await createMessage({
                    channelId: channelId as string,
                    messageData: { content: writtenMessage }
                });
                setWrittenMessage('');
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
            }
        },
        [channelId, writtenMessage, createMessage]
    );

    const handleChangeDeletionStatus = useCallback(
        async (id: string, messageData: Omit<Message, 'id' | 'createdAt' | 'user'>) => {
            const { isDeleted } = messageData;
            messageData.isDeleted = !isDeleted;
            await updateMessage({ id, messageData });
        },
        [updateMessage]
    );

    const handleMessageChange = () => {
        const inputElement = inputRef.current;
        if (inputElement) {
            const subscription = fromEvent(inputElement, 'input')
                .pipe(
                    debounceTime(200),
                    map((event: Event) => (event.target as HTMLInputElement).value)
                )
                .subscribe(value => {
                    setWrittenMessage(value);
                });

            return () => {
                subscription.unsubscribe();
            };
        }
    };

    return (
        <ChannelView
            inputRef={inputRef}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            errorMessages={errorMessages}
            channel={channel}
            isLoadingChannel={isLoadingChannel}
            errorChannel={errorChannel}
            currentUser={currentUser}
            handleMessageChange={handleMessageChange}
            sendMessage={sendMessage}
            handleChangeDeletionStatus={handleChangeDeletionStatus}
        />
    );
}
