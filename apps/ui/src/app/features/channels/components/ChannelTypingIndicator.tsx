import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

interface ChannelTypingIndicatorProps {
    typingUsers: { id: string; firstName: string }[];
}

const ChannelTypingIndicator: React.FC<ChannelTypingIndicatorProps> = ({ typingUsers }) => {
    if (typingUsers.length === 0) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                right: 0,
                padding: '4px 24px',
                marginBottom: '-4px',
                backgroundColor: 'background.paper',
                zIndex: 1
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    fontWeight: 600,
                    fontSize: '0.90rem'
                }}
            >
                {typingUsers.length === 1
                    ? `${typingUsers[0].firstName} is typing...`
                    : `${typingUsers.map(user => user.firstName).join(', ')} are typing...`}
            </Typography>
        </Box>
    );
};

export default ChannelTypingIndicator;
