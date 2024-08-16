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
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import MessageComponent from './MessageComponent';
import { RootState } from '../../../store/store';
import SendIcon from '@mui/icons-material/Send';
import { User } from '../../../types/login/User.types';
import { useChannelSocket } from '../hooks/useChannelSocket';
import { useGetChannelByIdQuery } from '../../../api/channels-api/channels-api';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ChannelComponent() {
    const { id: channelId } = useParams<string>();
    const [writtenMessage, setWrittenMessage] = useState<string>('');
    const lastMessageRef = useRef<HTMLLIElement>(null);

    const { channelMessages, sendChannelMessage } = useChannelSocket(channelId as string);

    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const {
        data: channel,
        isLoading: isLoadingChannel,
        error: errorChannel
    } = useGetChannelByIdQuery(channelId as string);

    const currentUser: User = useSelector((state: RootState) => state.auth.user) as User;

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setWrittenMessage(event.target.value);
    };

    const sendMessage = async (event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault();
        }

        if (writtenMessage) {
            sendChannelMessage(writtenMessage);
            setWrittenMessage('');
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (lastMessageRef.current) {
                lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    useEffect(() => {
        if (channelMessages.length > 0) {
            scrollToBottom();
        }
    }, [channelMessages]);

    useEffect(() => {
        scrollToBottom();
    }, []);

    if (isOffline) {
        return (
            <Alert severity="warning">
                You are currently offline. Messages will be sent when you're back online.
            </Alert>
        );
    }

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
                    {!channelMessages || channelMessages.length === 0 ? (
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
                                        index === channelMessages.length - 1 ? lastMessageRef : null
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
                <Box padding={3} bgcolor="background.paper">
                    <Grid container spacing={2} alignItems="center">
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
                            >
                                <SendIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}
