import {
    Avatar,
    Box,
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
    Stack,
    Typography
} from '@mui/material';
import { ChevronLeft, Logout } from '@mui/icons-material';

import { Link } from 'react-router-dom';
import MsgLogo from '../../../../assets/msg_logo.png';
import { RootState } from '../../../store/store';
import SidebarItem from './SidebarItem';
import { Channel } from '../../../types/channel/channel.types';
import { useSelector } from 'react-redux';
import { generateUserName } from '../../../utils/utils';
import { getColor } from '../../../lib/avatar-colors';

type SidebarViewProps = {
    menuOpen: boolean;
    anchorElement: HTMLElement | null;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleLogout: () => void;
    handleClose: () => void;
    channels: Channel[] | undefined;
    toggleSidebar: () => void;
    sidebarOpen: boolean;
};

export default function SidebarView({
    menuOpen,
    anchorElement,
    handleClick,
    handleClose,
    channels,
    toggleSidebar,
    sidebarOpen,
    handleLogout
}: SidebarViewProps) {
    const user = useSelector((state: RootState) => state.auth.user);
    if (!user) return null;

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={sidebarOpen}
            sx={{
                width: '16.666667%',
                textAlign: 'center',
                '& .MuiDrawer-paper': {
                    width: '16.666667%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }
            }}
        >
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <Stack alignItems="center" sx={{ my: 3 }}>
                    <Link to={'/'}>
                        <Box
                            component="img"
                            sx={{
                                maxWidth: '50%',
                                marginBottom: 1
                            }}
                            src={MsgLogo}
                            alt="msg logo"
                        />
                    </Link>
                </Stack>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    My Channels
                </Typography>
                <List>
                    {channels?.map(channel => <SidebarItem key={channel.id} channel={channel} />)}
                </List>
                {channels?.length === 0 && (
                    <Typography variant="h6">You haven't joined any channels yet!</Typography>
                )}
            </Box>
            <div>
                <Divider />
                <ListItem disablePadding sx={{ marginY: 1 }}>
                    <ListItemButton
                        aria-controls={menuOpen ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <ListItemIcon>
                            <Avatar
                                style={{
                                    backgroundColor: getColor(
                                        user.firstName.charAt(0).toUpperCase()
                                    )
                                }}
                            >
                                {user.firstName.charAt(0)}
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText
                            primary={generateUserName(user.firstName, user.lastName)}
                            secondary={user.email}
                        />
                    </ListItemButton>
                </ListItem>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorElement}
                    open={menuOpen}
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
                    <MenuItem onClick={handleLogout}>
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
                sx={{
                    position: 'absolute !important',
                    top: '50%',
                    right: '0px',
                    transform: 'translateY(-50%)'
                }}
            >
                <ChevronLeft />
            </IconButton>
        </Drawer>
    );
}
