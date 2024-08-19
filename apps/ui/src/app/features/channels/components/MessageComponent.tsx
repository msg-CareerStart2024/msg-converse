import { Avatar, Box, ListItemText, MenuItem, useTheme } from '@mui/material';
import { Message, MessageComponentProps } from '../../../types/messages/Message.types';
import { getColor } from '../../../lib/avatar-colors';
import { UserRole } from '../../../types/login/UserRole.enum';
import { User } from '../../../types/login/User.types';
import HoverMenu from 'material-ui-popup-state/HoverMenu';
import { bindHover, bindMenu, usePopupState } from 'material-ui-popup-state/hooks';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';

type UnifiedMessageProps = MessageComponentProps & {
    currentUser: User;
    handleChangeDeletionStatus: (
        id: string,
        messageData: Omit<Message, 'id' | 'createdAt' | 'user'>
    ) => void;
};

const MessageComponent: React.FC<UnifiedMessageProps> = ({
    message,
    currentUser,
    handleChangeDeletionStatus
}) => {
    const theme = useTheme();
    const firstNameInitial: string = message.user.firstName[0].toUpperCase();
    const isSent: boolean = message.user.id === currentUser.id;
    const isDeleted: boolean = message.isDeleted;

    const avatarStyle = {
        marginInline: 2,
        backgroundColor: getColor(firstNameInitial)
    };

    const messageBoxStyle = {
        width: 'fit-content',
        backgroundColor: isSent ? theme.palette.secondary.main : theme.palette.primary.main,
        color: isSent ? 'black' : 'white',
        borderRadius: '20px',
        padding: 1,
        paddingX: 2,
        textAlign: isSent ? 'left' : 'right',
        position: 'relative',
        marginBottom: 1
    };

    const popupState = usePopupState({
        variant: 'popover',
        popupId: 'messageMenu'
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isSent ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: isSent ? 'flex-end' : 'flex-start'
            }}
        >
            <Avatar variant="circular" sx={avatarStyle} onMouseLeave={() => console.log('left')}>
                {firstNameInitial}
            </Avatar>
            <Box sx={messageBoxStyle} {...bindHover(popupState)}>
                <ListItemText
                    primary={
                        !isDeleted
                            ? message.content
                            : currentUser.role === UserRole.ADMIN
                              ? 'This message was removed by a Moderator'
                              : currentUser.role === UserRole.USER
                                ? 'This message was removed by a Board Administrator'
                                : ''
                    }
                />

                <HoverMenu
                    {...bindMenu(popupState)}
                    sx={{ display: 'flex', flexDirection: 'row' }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Box sx={{ display: 'flex' }}>
                        {!isDeleted ? (
                            <MenuItem
                                onClick={() =>
                                    handleChangeDeletionStatus(message.id, {
                                        content: message.content,
                                        isPinned: message.isPinned,
                                        isDeleted
                                    })
                                }
                            >
                                <DeleteIcon />
                            </MenuItem>
                        ) : (
                            <MenuItem
                                onClick={() =>
                                    handleChangeDeletionStatus(message.id, {
                                        content: message.content,
                                        isPinned: message.isPinned,
                                        isDeleted
                                    })
                                }
                            >
                                <RestoreIcon />
                            </MenuItem>
                        )}
                    </Box>
                </HoverMenu>
            </Box>
        </Box>
    );
};

export default MessageComponent;
