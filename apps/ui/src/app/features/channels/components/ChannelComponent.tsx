import {
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
import SendIcon from '@mui/icons-material/Send';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Message } from '../../../types/messages/Message';
import MessageComponent from './MessageComponent';

const currentUserId = '1';

export default function ChannelComponent() {
    const [chatMessages, setChatMessages] = useState<Message[]>([
        {
            id: '0',
            text: 'Hello! How are you doing today?',
            firstNameInitial: 'K',
            userId: '2'
        },
        {
            id: '1',
            text: "I'm good, thanks for asking! What about you?",
            firstNameInitial: 'M',
            userId: currentUserId
        }
    ]);
    const [message, setMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const sendMessage = () => {
        if (message) {
            const newMessage = {
                id: (chatMessages.length + 1).toString(),
                text: message,
                firstNameInitial: 'M',
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
                            <List sx={{ height: '65vh', overflow: 'auto' }}>
                                {chatMessages.map((chatMessage: Message) => (
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
                                        <MessageComponent
                                            message={chatMessage.text}
                                            firstNameInitial={chatMessage.firstNameInitial}
                                            isSent={chatMessage.userId === currentUserId}
                                        />
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
