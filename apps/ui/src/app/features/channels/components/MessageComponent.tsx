import { Avatar, Box, ListItemText, Menu, MenuItem, useTheme } from '@mui/material';
import { Message, MessageComponentProps } from '../../../types/messages/Message.types';
import { getColor } from '../../../lib/avatar-colors';
import { UserRole } from '../../../types/login/UserRole.enum';
import { User } from '../../../types/login/User.types';
import { MouseEvent, useState } from 'react';
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
        textAlign: isSent ? 'left' : 'right'
    };

    const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    const handleMenuOpen = (event: MouseEvent<HTMLElement>, message: Message) => {
        setAnchorElement(event.currentTarget);
        setSelectedMessage(message);
    };

    const handleMenuClose = () => {
        setAnchorElement(null);
        setSelectedMessage(null);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isSent ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: isSent ? 'flex-end' : 'flex-start'
            }}
        >
            <Avatar variant="circular" sx={avatarStyle}>
                {firstNameInitial}
            </Avatar>
            <Box
                sx={messageBoxStyle}
                onMouseEnter={event => handleMenuOpen(event, message)}
                onMouseLeave={handleMenuClose}
            >
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
                <Menu
                    anchorEl={anchorElement}
                    open={
                        Boolean(anchorElement) &&
                        selectedMessage === message &&
                        currentUser.role === UserRole.ADMIN
                    }
                    onClose={handleMenuClose}
                    MenuListProps={{ sx: { display: 'flex', flexDirection: 'row' } }}
                >
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
                </Menu>
            </Box>
        </Box>
    );
};

export default MessageComponent;
