import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { getColor } from '../../../lib/avatar-colors';
import { Channel } from '../../../types/channels/Channel';

type SidebarItemProps = {
    channel: Channel;
};

export default function SidebarItem({ channel }: SidebarItemProps) {
    return (
        <ListItem disablePadding>
            <Link
                to={`/channels/${channel.id}`}
                style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
            >
                <ListItemButton>
                    <ListItemIcon>
                        <Avatar
                            style={{
                                backgroundColor: getColor(channel.name.charAt(0).toUpperCase())
                            }}
                        >
                            {channel.name.charAt(0)}
                        </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={channel.name} />
                </ListItemButton>
            </Link>
        </ListItem>
    );
}
