import { Avatar, Box, ListItemText, useTheme } from '@mui/material';

import { MessageComponentProps } from '../../../types/messages/Message.types';
import { getColor } from '../../../lib/avatar-colors';

type UnifiedMessageProps = MessageComponentProps & {
    isSent: boolean;
};

const MessageComponent: React.FC<UnifiedMessageProps> = ({ message, firstNameInitial, isSent }) => {
    const theme = useTheme();

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
            <Box sx={messageBoxStyle}>
                <ListItemText primary={message} />
            </Box>
        </Box>
    );
};

export default MessageComponent;
