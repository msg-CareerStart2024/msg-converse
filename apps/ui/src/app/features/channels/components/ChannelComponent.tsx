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
import { useCallback, useEffect, useRef, useState } from 'react';
import MessageComponent from './MessageComponent';
import { RootState } from '../../../store/store';
import SendIcon from '@mui/icons-material/Send';
import { User } from '../../../types/login/User.types';
import { useChannelSocket } from '../hooks/useChannelSocket';
import { useGetChannelByIdQuery } from '../../../api/channels-api/channels-api';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ChannelComponent: React.FC = () => {
    const { id: channelId } = useParams<{ id: string }>();
    const [writtenMessage, setWrittenMessage] = useState('');
    const messagesEndRef = useRef<HTMLLIElement>(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    const { channelMessages, sendChannelMessage } = useChannelSocket(channelId as string);
    const {
        data: channel,
        isLoading: isLoadingChannel,
        error: errorChannel
    } = useGetChannelByIdQuery(channelId as string);

    const currentUser: User = useSelector((state: RootState) => state.auth.user as User);

    const handleOnlineStatus = useCallback(() => {
        setIsOffline(!navigator.onLine);
    }, []);

    useEffect(() => {
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, [handleOnlineStatus]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (channelMessages.length > 0) {
            scrollToBottom();
        }
    }, [channelMessages, scrollToBottom]);

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWrittenMessage(event.target.value);
    };

    const sendMessage = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        if (writtenMessage.trim()) {
            sendChannelMessage(writtenMessage);
            setWrittenMessage('');
        }
    };

    if (isLoadingChannel) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (errorChannel) {
        return <Alert severity="error">There has been an error loading the channel</Alert>;
    }

    return (
        <Container>
            <Typography variant="h6" marginBottom={5}>
                {channel?.name}
            </Typography>
            <Paper sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
                <Box flex={1} overflow="auto" padding={3}>
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
                        <List>
                            {channelMessages.map((message, index) => (
                                <ListItem
                                    ref={
                                        index === channelMessages.length - 1 ? messagesEndRef : null
                                    }
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
                                        message={message.content}
                                        firstNameInitial={message.user.firstName[0].toUpperCase()}
                                        isSent={message.user.id === currentUser.id}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
                {isOffline && (
                    <Alert severity="warning" sx={{ margin: 2 }}>
                        You are currently offline. Messages will be sent when you're back online.
                    </Alert>
                )}
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
                                disabled={isOffline}
                            >
                                <SendIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
};

export default ChannelComponent;
