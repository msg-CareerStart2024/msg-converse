import { Avatar, Box, ListItemText, useTheme } from '@mui/material';
import { getColor } from '../../../lib/avatar-colors';

// This file was taken from Darius, because he hasn't got to merge his branch to main and I needed this for my task

export interface MessageComponentProps {
    message: string;
    firstNameInitial: string;
}

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
