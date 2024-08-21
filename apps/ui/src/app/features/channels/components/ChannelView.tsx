import SendIcon from '@mui/icons-material/Send';
import {
    Alert,
    Box,
    CircularProgress,
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
import ChannelTypingIndicator from './ChannelTypingIndicator';

type ChannelProps = {
    channelMessages: Message[] | undefined;
    channel: Channel | undefined;
    isLoadingChannel: boolean;
    errorChannel: FetchBaseQueryError | SerializedError | undefined;
    currentUser: User;
    writtenMessage: string;
    isOffline: boolean;
    handleMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sendMessage: (event?: FormEvent<HTMLFormElement>) => void;
    handleChangeDeletionStatus: (
        id: string,
        messageData: Omit<Message, 'id' | 'content' | 'createdAt' | 'user'>
    ) => void;
    typingUsers: string[];
};

export default function ChannelView({
    channelMessages,
    channel,
    isLoadingChannel,
    errorChannel,
    currentUser,
    writtenMessage,
    isOffline,
    handleMessageChange,
    sendMessage,
    handleChangeDeletionStatus,
    typingUsers
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
    }, [channelMessages?.length, scrollToBottom]);

    if (isLoadingChannel) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (errorChannel || !channelMessages) {
        return <Alert severity="error">There has been an error loading the channel</Alert>;
    }

    return (
        <Container>
            <Typography variant="h6" marginBottom={5}>
                {channel?.name}
            </Typography>

            <Paper sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
                <Box
                    flex={1}
                    overflow="auto"
                    padding={3}
                    sx={{
                        '&::-webkit-scrollbar': {
                            display: 'none'
                        }
                    }}
                >
                    {channelMessages.length === 0 ? (
                        <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                        >
                            <Typography color="text.secondary" align="center">
                                Empty? Be the one to initiate the conversation!
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ height: '65dvh', overflow: 'auto' }}>
                            {channelMessages.map(message => (
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
                                        handleChangeDeletionStatus={handleChangeDeletionStatus}
                                    />
                                </ListItem>
                            ))}
                            <div ref={messagesEndRef} />
                        </List>
                    )}
                </Box>

                {isOffline && (
                    <Alert severity="warning" sx={{ margin: 2 }}>
                        You are currently offline. Messages will be sent when you're back online.
                    </Alert>
                )}

                <Box position="relative">
                    <ChannelTypingIndicator typingUsers={typingUsers} />
                    <Box component="form" onSubmit={sendMessage} padding={3}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={11}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Type your message"
                                        variant="outlined"
                                        value={writtenMessage}
                                        onChange={handleMessageChange}
                                        disabled={isOffline}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton
                                    type="submit"
                                    aria-label="send"
                                    color="primary"
                                    onClick={() => sendMessage()}
                                    disabled={isOffline}
                                >
                                    <SendIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
