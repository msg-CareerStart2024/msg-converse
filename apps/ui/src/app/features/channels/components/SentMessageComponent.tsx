import { Avatar, Box, ListItemText, useTheme } from '@mui/material';
import { MessageComponentProps } from '../../../types/messages/Message';
import { getColor } from '../../../lib/avatar-colors';

const SentMessageComponent: React.FC<MessageComponentProps> = ({ message, firstNameInitial }) => {
    const theme = useTheme();
    return (
        <>
            <Box sx={{ width: 'fit-content', maxWidth: '75%' }}>
                <ListItemText
                    primary={message}
                    sx={{
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: '20px',
                        padding: 1,
                        paddingX: 2,
                        textAlign: 'left'
                    }}
                />
            </Box>
            <Avatar
                variant="circular"
                sx={{
                    marginInline: 2,
                    backgroundColor: getColor(firstNameInitial)
                }}
            >
                {firstNameInitial}
            </Avatar>
        </>
    );
};

export default SentMessageComponent;
