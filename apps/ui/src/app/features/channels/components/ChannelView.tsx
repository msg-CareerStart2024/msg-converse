import SendIcon from '@mui/icons-material/Send';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Popover,
    Stack,
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
import { Close, PushPin } from '@mui/icons-material';
import { generateUserName } from '../../../utils/utils';
import { UserRole } from '../../../types/login/UserRole.enum';

type ChannelProps = {
    channelMessages: Message[] | undefined;
    channel: Channel | undefined;
    isLoadingChannel: boolean;
    errorChannel: FetchBaseQueryError | SerializedError | undefined;
    currentUser: User;
    writtenMessage: string;
    isOffline: boolean;
    popoverOpen: boolean;
    popoverAnchor: HTMLElement | null;
    setPopoverAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    handleMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sendMessage: (event?: FormEvent<HTMLFormElement>) => void;
    handleChangeDeletionStatus: (
        id: string,
        messageData: Omit<Message, 'id' | 'content' | 'createdAt' | 'user'>
    ) => void;
    handlePinStatus: (messageId: string, pinStatus: boolean) => void;
};

export default function ChannelView({
    channelMessages,
    channel,
    isLoadingChannel,
    errorChannel,
    currentUser,
    writtenMessage,
    isOffline,
    popoverOpen,
    popoverAnchor,
    setPopoverAnchor,
    handleMessageChange,
    sendMessage,
    handleChangeDeletionStatus,
    handlePinStatus
}: ChannelProps) {
    const pinnedMessages = channelMessages?.filter(channelMessage => channelMessage.isPinned) || [];
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
            <Stack flexDirection="row" justifyContent="space-between">
                <Typography variant="h6" marginBottom={5}>
                    {channel?.name}
                </Typography>

                <Popover
                    id={popoverOpen ? 'pinned-messages-popover' : undefined}
                    open={popoverOpen}
                    anchorEl={popoverAnchor}
                    onClose={() => setPopoverAnchor(null)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                >
                    <div
                        style={{
                            padding: '16px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            width: '400px',
                            wordWrap: 'break-word',
                            whiteSpace: 'normal',
                            overflowWrap: 'anywhere'
                        }}
                    >
                        <Typography variant="h5">Pinned Messages</Typography>
                        <Divider />
                        <List>
                            {pinnedMessages.length > 0 ? (
                                pinnedMessages.map((message, index) => (
                                    <div key={'PIN' + message.id}>
                                        <ListItem
                                            disablePadding
                                            secondaryAction={
                                                currentUser.role === UserRole.ADMIN && (
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="unpin"
                                                        onClick={() =>
                                                            handlePinStatus(message.id, false)
                                                        }
                                                    >
                                                        <Close />
                                                    </IconButton>
                                                )
                                            }
                                        >
                                            <ListItemText
                                                primary={message.content}
                                                secondary={generateUserName(
                                                    message.user.firstName,
                                                    message.user.lastName
                                                )}
                                                primaryTypographyProps={{
                                                    style: {
                                                        paddingRight:
                                                            currentUser.role === UserRole.ADMIN
                                                                ? '50px'
                                                                : 0
                                                    }
                                                }}
                                            />
                                        </ListItem>
                                        {index < pinnedMessages.length - 1 && <Divider />}
                                    </div>
                                ))
                            ) : (
                                <Typography variant="body2">No pinned messages</Typography>
                            )}
                        </List>
                    </div>
                </Popover>
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ height: 'fit-content' }}
                    onClick={event => setPopoverAnchor(popoverAnchor ? null : event.currentTarget)}
                    aria-describedby={popoverOpen ? 'pinned-messages-popover' : undefined}
                    aria-label="Pinned messages"
                >
                    <PushPin />
                </Button>
            </Stack>

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
                                        handlePinStatus={handlePinStatus}
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
            </Paper>
        </Container>
    );
}
