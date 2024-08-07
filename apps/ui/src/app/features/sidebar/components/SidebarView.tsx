import {
    Avatar,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import MsgLogo from '../../../../assets/msg_logo.png';
import styles from '../styles/SidebarView.module.css';
import SidebarItem from './SidebarItem';
import { Logout } from '@mui/icons-material';
import { USER } from '../../channels/static';
import { Channel } from '../../../types/channels/Channel';

type SidebarViewProps = {
    open: boolean;
    anchorEl: HTMLElement | null;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleClose: () => void;
    channels: Channel[];
};

export default function SidebarView({
    open,
    anchorEl,
    handleClick,
    handleClose,
    channels
}: SidebarViewProps) {
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            className={styles.drawer}
            sx={{
                width: '16.666667%',
                '& .MuiDrawer-paper': {
                    width: '16.666667%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                },
                textAlign: 'center'
            }}
        >
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <div className={styles.sidebarImageContainer}>
                    <img className={styles.sidebarImage} src={MsgLogo} alt={'msg logo'} />
                </div>
                <Typography variant="h6" sx={{ p: 2 }}>
                    My Channels
                </Typography>
                <List>
                    {channels.map(channel => (
                        <SidebarItem key={channel.id} name={channel.name} />
                    ))}
                </List>
            </div>
            <div>
                <Divider />
                <ListItem disablePadding sx={{ marginY: '3px' }}>
                    <ListItemButton
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <ListItemIcon>
                            <Avatar>{USER.charAt(0)}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={USER} />
                    </ListItemButton>
                </ListItem>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button'
                    }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                >
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Sign out" />
                    </MenuItem>
                </Menu>
            </div>
        </Drawer>
    );
}
