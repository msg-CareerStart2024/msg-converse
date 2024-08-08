import { ListItem, ListItemButton, ListItemIcon, Avatar, ListItemText } from '@mui/material';
import { getColor } from '../../../lib/avatar-colors';

type SidebarItemProps = {
    name: string;
};

export default function SidebarItem({ name }: SidebarItemProps) {
    return (
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemIcon>
                    <Avatar style={{ backgroundColor: getColor(name.charAt(0).toUpperCase()) }}>
                        {name.charAt(0)}
                    </Avatar>
                </ListItemIcon>
                <ListItemText primary={name} />
            </ListItemButton>
        </ListItem>
    );
}
