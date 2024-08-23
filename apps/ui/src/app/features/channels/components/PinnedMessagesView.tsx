import { Close, PushPin } from '@mui/icons-material';
import {
    Box,
    Button,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Popover,
    Typography
} from '@mui/material';
import { User } from '../../../types/login/User.types';
import { UserRole } from '../../../types/login/UserRole.enum';
import { Message } from '../../../types/messages/Message.types';
import { generateUserName } from '../../../utils/utils';

type PinnedMessagesViewProps = {
    popoverOpen: boolean;
    popoverAnchor: HTMLElement | null;
    pinnedMessages: Message[];
    currentUser: User;
    setPopoverAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    handlePinStatus: (messageId: string, pinStatus: boolean) => void;
    scrollToMessage: (messageId: string) => void;
};

export default function PinnedMessagesView({
    popoverAnchor,
    popoverOpen,
    pinnedMessages,
    currentUser,
    setPopoverAnchor,
    handlePinStatus,
    scrollToMessage
}: PinnedMessagesViewProps) {
    const handlePinnedMessageClick = (messageId: string) => {
        scrollToMessage(messageId);
        setPopoverAnchor(null);
    };

    return (
        <>
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
                <Box
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
                                <Box key={'PIN' + message.id}>
                                    <ListItem
                                        disablePadding
                                        secondaryAction={
                                            currentUser.role === UserRole.ADMIN && (
                                                <IconButton
                                                    edge="end"
                                                    aria-label="unpin"
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        handlePinStatus(message.id, false);
                                                    }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            )
                                        }
                                        onClick={() => handlePinnedMessageClick(message.id)}
                                        sx={{
                                            cursor: 'pointer',
                                            padding: 1,
                                            transition: 'all .1s ease-in-out',
                                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1 )' }
                                        }}
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
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2">No pinned messages</Typography>
                        )}
                    </List>
                </Box>
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
        </>
    );
}
