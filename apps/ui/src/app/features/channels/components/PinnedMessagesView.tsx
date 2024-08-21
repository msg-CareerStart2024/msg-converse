import { Close, PushPin } from '@mui/icons-material';
import {
    Popover,
    Typography,
    Divider,
    List,
    ListItem,
    IconButton,
    ListItemText,
    Button
} from '@mui/material';
import { UserRole } from '../../../types/login/UserRole.enum';
import { generateUserName } from '../../../utils/utils';
import { Message } from '../../../types/messages/Message.types';
import { User } from '../../../types/login/User.types';

type PinnedMessagesViewProps = {
    popoverOpen: boolean;
    popoverAnchor: HTMLElement | null;
    pinnedMessages: Message[];
    currentUser: User;
    setPopoverAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    handlePinStatus: (messageId: string, pinStatus: boolean) => void;
};

export default function PinnedMessagesView({
    popoverAnchor,
    popoverOpen,
    pinnedMessages,
    currentUser,
    setPopoverAnchor,
    handlePinStatus
}: PinnedMessagesViewProps) {
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
        </>
    );
}
