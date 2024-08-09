import { Avatar, Box } from '@mui/material';
import React from 'react';

interface UserAvatarProps {
    userInitial: string;
}

function UserAvatar({ userInitial }: UserAvatarProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
            <Avatar sx={{ bgcolor: 'gray', width: 64, height: 64 }}>{userInitial}</Avatar>
        </Box>
    );
}

export default UserAvatar;
