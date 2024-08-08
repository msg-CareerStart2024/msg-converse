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
import MsgLogo from '../../../../assets/msg_logo.png';
import SidebarItem from './SidebarItem';
import { ChevronLeft, Logout } from '@mui/icons-material';
import { USER } from '../../channels/static';
import { Channel } from '../../../types/channels/Channel';

type SidebarViewProps = {
    menuOpen: boolean;
    anchorElelement: HTMLElement | null;
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleClose: () => void;
    channels: Channel[];
    toggleSidebar: () => void;
    sidebarOpen: boolean;
};

export default function SidebarView({
    menuOpen,
    anchorElelement,
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
                    <Box
                        component="img"
                        sx={{
                            maxWidth: '50%',
                            marginBottom: 1
                        }}
                        src={MsgLogo}
                        alt="msg logo"
                    />
                </Stack>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    My Channels
                </Typography>
                <List>
                    {channels.map(channel => (
                        <SidebarItem key={channel.id} name={channel.name} />
                    ))}
                </List>
                {channels.length === 0 && (
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
                            <Avatar>{USER.charAt(0)}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={USER} />
                    </ListItemButton>
                </ListItem>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorElelement}
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
