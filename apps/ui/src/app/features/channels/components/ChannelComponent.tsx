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
    Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { ChangeEvent, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

const messages = [
    {
        id: 1,
        text: 'Hello there',
        avatar: 'M',
        userColor: 'orange',
        userId: 1
    },
    {
        id: 2,
        text: 'The fallen leaves tell a story. Of how a Tarnished became Elden Lord',
        avatar: 'K',
        userColor: 'green',
        userId: 2
    },
    {
        id: 3,
        text: 'One unbreakable shield against the coming darkness, One last blade, forged in defiance of fate. Let them be my legacy to the galaxy I conquered, And my final gift to a species I failed',
        avatar: 'M',
        userColor: 'orange',
        userId: 1
    }
];

const currentUserId = 1;

export default function ChannelComponent() {
    const [chatMessages, setChatMessages] = useState(messages);
    const [message, setMessage] = useState('');

    const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const sendMessage = () => {
        if (message) {
            const newMessage = {
                id: chatMessages.length + 1,
                text: message,
                avatar: 'M',
                userColor: 'orange',
                userId: currentUserId
            };
            setChatMessages([...chatMessages, newMessage]);
            setMessage('');
        }
    };

    return (
        <Fragment>
            <Typography variant="h3" marginBottom={3}>
                Msg Converse
            </Typography>
            <Typography variant="h6">Msg Romania Channel</Typography>
            <Container>
                <Paper elevation={5}>
                    <Box padding={3}>
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12}>
                                <List sx={{ maxHeight: '500px', overflow: 'auto' }}>
                                    {chatMessages.map(chatMessage => (
                                        <ListItem
                                            key={chatMessage.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: 2,
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
                                                            backgroundColor: chatMessage.userColor
                                                        }}
                                                    >
                                                        {chatMessage.avatar}
                                                    </Avatar>
                                                    <ListItemText
                                                        primary={chatMessage.text}
                                                        sx={{
                                                            textAlign:
                                                                chatMessage.userId === currentUserId
                                                                    ? 'right'
                                                                    : 'left',
                                                            maxWidth: '75%'
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <ListItemText
                                                        primary={chatMessage.text}
                                                        sx={{
                                                            textAlign:
                                                                chatMessage.userId === currentUserId
                                                                    ? 'right'
                                                                    : 'left',
                                                            maxWidth: '75%'
                                                        }}
                                                    />
                                                    <Avatar
                                                        variant="circular"
                                                        sx={{
                                                            marginInline: 2,
                                                            backgroundColor: chatMessage.userColor
                                                        }}
                                                    >
                                                        {chatMessage.avatar}
                                                    </Avatar>
                                                </>
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </Grid>
                            <Grid item xs={11}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Type your message"
                                        variant="outlined"
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
        </Fragment>
    );
}
