import {
    Avatar,
    Divider,
    Drawer,
    IconButton,
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
import { ChevronLeft, Logout } from '@mui/icons-material';
import { USER } from '../../channels/static';
import { Channel } from '../../../types/channels/Channel';

type SidebarViewProps = {
    open: boolean;
    anchorEl: HTMLElement | null;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleClose: () => void;
    channels: Channel[];
    toggleSidebar: () => void;
    sidebarOpen: boolean;
};

export default function SidebarView({
    open,
    anchorEl,
    handleClick,
    handleClose,
    channels,
    toggleSidebar,
    sidebarOpen
}: SidebarViewProps) {
    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={true}
            className={styles.drawer}
            classes={{ paper: styles.drawerPaper }}
        >
            <div className={styles.scrollableUpperPart}>
                <div className={styles.sidebarImageContainer}>
                    <img className={styles.sidebarImage} src={MsgLogo} alt={'msg logo'} />
                </div>
                <Typography variant="h6" className={styles.sidebarTitle}>
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
                <ListItem disablePadding className={styles.userListItem}>
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
            <IconButton
                color="inherit"
                aria-label="close drawer"
                onClick={toggleSidebar}
                className={styles.closeButton}
            >
                <ChevronLeft />
            </IconButton>
        </Drawer>
    );
}
