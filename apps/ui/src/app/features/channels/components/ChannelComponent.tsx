import SendIcon from '@mui/icons-material/Send';
import {
    Alert,
    Box,
    Container,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetChannelByIdQuery } from '../../../api/channels-api/channels-api';
import {
    useCreateMessageMutation,
    useGetMessagesByChannelIdQuery
} from '../../../api/messages-api/messages-api';
import { RootState } from '../../../store/store';
import { User } from '../../../types/login/User.types';
import MessageComponent from './MessageComponent';

export default function ChannelComponent() {
    const { id: channelId } = useParams<string>();

    const {
        data: messages,
        isLoading: isLoadingMessages,
        error: errorMessages
    } = useGetMessagesByChannelIdQuery(channelId as string);
    const [createMessage] = useCreateMessageMutation();

    const {
        data: channel,
        isLoading: isLoadingChannel,
        error: errorChannel
    } = useGetChannelByIdQuery(channelId as string);

    const currentUser: User = useSelector((state: RootState) => state.auth.user) as User;

    const [writtenMessage, setWrittenMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setWrittenMessage(event.target.value);
    };

    const sendMessage = async (event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }

        if (writtenMessage) {
            await createMessage({
                channelId: channelId as string,
                messageData: { content: writtenMessage }
            });
            setWrittenMessage('');
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (isLoadingMessages || isLoadingChannel) {
        return <Typography>Loading...</Typography>;
    }

    if (errorMessages) {
        return <Alert severity="error">There has been an error loading the messages</Alert>;
    }

    if (errorChannel) {
        return <Alert severity="error">There has been an error loading the channel</Alert>;
    }

    return (
        <Container>
            <Typography variant="h6" marginBottom={5}>
                {channel?.name}
            </Typography>
            {!messages ? (
                <Alert severity="warning">There are no messages in this chat</Alert>
            ) : (
                <Paper>
                    <Box padding={3}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12}>
                                <List sx={{ height: '65dvh', overflow: 'auto' }}>
                                    {[...messages]
                                        .sort(
                                            (m1, m2) =>
                                                new Date(m1.createdAt).getTime() -
                                                new Date(m2.createdAt).getTime()
                                        )
                                        .map(message => (
                                            <ListItem
                                                key={message.id}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: 1,
                                                    justifyContent:
                                                        message.user.id === currentUser.id
                                                            ? 'flex-end'
                                                            : 'flex-start'
                                                }}
                                            >
                                                <MessageComponent
                                                    message={message}
                                                    user={message.user}
                                                    isSent={message.user.id === currentUser.id}
                                                />
                                            </ListItem>
                                        ))}
                                    <div ref={messagesEndRef} />
                                </List>
                            </Grid>
                            <Grid item xs={11}>
                                <form onSubmit={sendMessage} style={{ display: 'flex' }}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label="Type your message"
                                            variant="outlined"
                                            value={writtenMessage}
                                            onChange={handleMessageChange}
                                        />
                                    </FormControl>
                                </form>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton
                                    aria-label="send"
                                    color="primary"
                                    onClick={() => sendMessage()}
                                    disabled={isLoadingMessages}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            )}
        </Container>
    );
}
