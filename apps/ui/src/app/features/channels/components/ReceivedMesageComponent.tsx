import { Avatar, Box, ListItemText, useTheme } from '@mui/material';
import { MessageComponentProps } from '../../../types/messages/Message';
import { getColor } from '../../../lib/avatar-colors';

const ReceivedMessageComponent: React.FC<MessageComponentProps> = ({ message, avatar }) => {
    const theme = useTheme();
    return (
        <>
            <Avatar
                variant="circular"
                sx={{
                    marginInline: 2,
                    backgroundColor: getColor(avatar)
                }}
            >
                {avatar}
            </Avatar>
            <Box sx={{ width: 'fit-content', maxWidth: '75%' }}>
                <ListItemText
                    primary={message}
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        borderRadius: '20px',
                        padding: 1,
                        paddingX: 2
                    }}
                />
            </Box>
        </>
    );
};

export default ReceivedMessageComponent;
