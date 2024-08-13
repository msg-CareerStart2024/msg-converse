import SendIcon from '@mui/icons-material/Send';
import {
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
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getColor } from '../../../lib/avatar-colors';
import { Message } from '../../../types/messages/Message.types';

const currentUserId = '1';

export default function ChannelComponent() {
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const sendMessage = () => {
        if (message) {
            const newMessage = {
                id: (chatMessages.length + 1).toString(),
                text: message,
                avatar: 'M',
                userId: currentUserId
            };
            setChatMessages([...chatMessages, newMessage]);
            setMessage('');
        }
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    return (
        <Container>
            <Typography variant="h6" marginBottom={5}>
                Msg Romania Channel
            </Typography>
            <Paper>
                <Box padding={3}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12}>
                            <List sx={{ height: '65dvh', overflow: 'auto' }}>
                                {chatMessages.map(chatMessage => (
                                    <ListItem
                                        key={chatMessage.id}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: 1,
                                            justifyContent:
                                                chatMessage.userId === currentUserId
                                                    ? 'flex-end'
                                                    : 'flex-start'
                                        }}
                                    >
                                        {chatMessage.userId !== currentUserId ? (
                                            <>
                                                <Avatar
                                                    variant="circular"
                                                    sx={{
                                                        marginInline: 2,
                                                        backgroundColor: getColor(
                                                            chatMessage.avatar
                                                        )
                                                    }}
                                                >
                                                    {chatMessage.avatar}
                                                </Avatar>
                                                <Box sx={{ width: 'fit-content', maxWidth: '75%' }}>
                                                    <ListItemText
                                                        primary={chatMessage.text}
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
                                                <Box sx={{ width: 'fit-content', maxWidth: '75%' }}>
                                                    <ListItemText
                                                        primary={chatMessage.text}
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
                                                            chatMessage.avatar
                                                        )
                                                    }}
                                                >
                                                    {chatMessage.avatar}
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
                                    value={message}
                                    onChange={handleMessageChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton aria-label="send" color="primary" onClick={sendMessage}>
                                <SendIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}
