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
import { FormEvent, useCallback, useEffect, useRef } from 'react';
import { Message } from '../../../types/messages/Message.types';
import { Channel } from '../../../types/channel/channel.types';
import { User } from '../../../types/login/User.types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';
import MessageContainer from './MessageContainer';

type ChannelProps = {
    messages: Message[] | undefined;
    isLoadingMessages: boolean;
    errorMessages: FetchBaseQueryError | SerializedError | undefined;
    channel: Channel | undefined;
    isLoadingChannel: boolean;
    errorChannel: FetchBaseQueryError | SerializedError | undefined;
    currentUser: User;
    writtenMessage: string;
    handleMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sendMessage: (event?: FormEvent<HTMLFormElement>) => void;
    handleChangeDeletionStatus: (
        id: string,
        messageData: Omit<Message, 'id' | 'createdAt' | 'user'>
    ) => void;
};

export default function ChannelView({
    messages,
    isLoadingMessages,
    errorMessages,
    channel,
    isLoadingChannel,
    errorChannel,
    currentUser,
    writtenMessage,
    handleMessageChange,
    sendMessage,
    handleChangeDeletionStatus
}: ChannelProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages?.length, scrollToBottom]);

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
                                    {messages.map(message => (
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
                                            <MessageContainer
                                                message={message}
                                                currentUser={currentUser}
                                                handleChangeDeletionStatus={
                                                    handleChangeDeletionStatus
                                                }
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
