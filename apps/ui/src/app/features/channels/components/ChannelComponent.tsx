import {
    Alert,
    Avatar,
    Box,
    Container,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getColor } from '../../../lib/avatar-colors';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { User } from '../../../types/login/User';
import { useParams } from 'react-router-dom';
import { useCreateMessageMutation, useGetMessageByChannelQuery } from '../../../api/messages-api';
import { useGetChannelByIdQuery } from '../../../api/channelsApi';

export default function ChannelComponent() {
    const { id: channelId } = useParams<string>();

    const {
        data: messages,
        isLoading: isLoadingMessages,
        error: errorMessages
    } = useGetMessageByChannelQuery(channelId as string);
    const [createMessage] = useCreateMessageMutation();

    const {
        data: channel,
        isLoading: isLoadingChannel,
        error: errorChannel
    } = useGetChannelByIdQuery(channelId as string);

    const currentUser: User = useSelector((state: RootState) => state.auth.user) as User;

    const [writtenMessage, setWrittenMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setWrittenMessage(event.target.value);
    };

    const sendMessage = async () => {
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
                                            {message.user.id !== currentUser.id ? (
                                                <>
                                                    <Avatar
                                                        variant="circular"
                                                        sx={{
                                                            marginInline: 2,
                                                            backgroundColor: getColor(
                                                                message.user.firstName[0].toUpperCase()
                                                            )
                                                        }}
                                                    >
                                                        {message.user.firstName[0].toUpperCase()}
                                                    </Avatar>
                                                    <Box
                                                        sx={{
                                                            width: 'fit-content',
                                                            maxWidth: '75%'
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={message.content}
                                                            sx={{
                                                                backgroundColor:
                                                                    theme.palette.primary.main,
                                                                borderRadius: '20px',
                                                                padding: 1,
                                                                paddingX: 2
                                                            }}
                                                        />
                                                    </Box>
                                                </>
                                            ) : (
                                                <>
                                                    <Box
                                                        sx={{
                                                            width: 'fit-content',
                                                            maxWidth: '75%'
                                                        }}
                                                    >
                                                        <ListItemText
                                                            primary={message.content}
                                                            sx={{
                                                                textAlign: 'left',
                                                                backgroundColor:
                                                                    theme.palette.secondary.main,
                                                                borderRadius: '20px',
                                                                padding: 1,
                                                                paddingX: 2
                                                            }}
                                                            color="primary"
                                                        />
                                                    </Box>
                                                    <Avatar
                                                        variant="circular"
                                                        sx={{
                                                            marginInline: 2,
                                                            backgroundColor: getColor(
                                                                message.user.firstName[0].toUpperCase()
                                                            )
                                                        }}
                                                    >
                                                        {message.user.firstName[0].toUpperCase()}
                                                    </Avatar>
                                                </>
                                            )}
                                        </ListItem>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </List>
                            </Grid>
                            <Grid item xs={11}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Type your message"
                                        variant="outlined"
                                        value={writtenMessage}
                                        onChange={handleMessageChange}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton
                                    aria-label="send"
                                    color="primary"
                                    onClick={sendMessage}
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
