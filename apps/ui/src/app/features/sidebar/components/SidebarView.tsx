import { AutoMode, ChevronLeft, DarkMode, LightMode, Logout } from '@mui/icons-material';
import {
    Avatar,
    Badge,
    BadgeProps,
    Box,
    Dialog,
    DialogTitle,
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
    styled,
    Typography
} from '@mui/material';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MsgLogo from '../../../../assets/msg_logo.png';
import { getColor } from '../../../lib/avatar-colors';
import { RootState } from '../../../store/store';
import { Channel } from '../../../types/channel/channel.types';
import { generateUserName } from '../../../utils/utils';
import SidebarItem from './SidebarItem';
import { UserRole } from '../../../types/login/UserRole.enum';

type SidebarViewProps = {
    menuOpen: boolean;
    anchorElement: HTMLElement | null;
    handleMenuOpen: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    handleLogout: () => void;
    handleMenuClose: () => void;
    channels: Channel[] | undefined;
    toggleSidebar: () => void;
    sidebarOpen: boolean;
    handleChooseTheme: (theme: 'dark' | 'light' | 'system') => void;
    handleDialogOpen: () => void;
    handleDialogClose: () => void;
    dialogOpen: boolean;
};

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
        right: -35,
        top: 12
    }
}));

export default function SidebarView({
    menuOpen,
    anchorElement,
    handleMenuOpen,
    handleMenuClose,
    channels,
    toggleSidebar,
    sidebarOpen,
    handleLogout,
    handleChooseTheme,
    handleDialogOpen,
    handleDialogClose,
    dialogOpen
}: SidebarViewProps) {
    const user = useSelector((state: RootState) => state.auth.user);
    if (!user) return null;

    return (
        <>
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
                        {channels?.map(channel => (
                            <SidebarItem key={channel.id} channel={channel} />
                        ))}
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
                            onClick={handleMenuOpen}
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
                                data-testid="logged-in-user"
                                primary={
                                    user.role === UserRole.ADMIN ? (
                                        <StyledBadge color="primary" badgeContent="ADMIN">
                                            {generateUserName(user.firstName, user.lastName)}
                                        </StyledBadge>
                                    ) : (
                                        generateUserName(user.firstName, user.lastName)
                                    )
                                }
                                secondary={user.email}
                            />
                        </ListItemButton>
                    </ListItem>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorElement}
                        open={menuOpen}
                        onClose={handleMenuClose}
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
                        <MenuItem onClick={handleDialogOpen}>
                            <ListItemIcon>
                                <LightMode />
                            </ListItemIcon>
                            <ListItemText primary="Theme" />
                        </MenuItem>
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
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Select theme</DialogTitle>
                <List sx={{ pt: 0 }}>
                    <ListItem disableGutters>
                        <ListItemButton onClick={() => handleChooseTheme('dark')}>
                            <ListItemIcon>
                                <DarkMode />
                            </ListItemIcon>
                            <ListItemText primary="Dark" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemButton onClick={() => handleChooseTheme('light')}>
                            <ListItemIcon>
                                <LightMode />
                            </ListItemIcon>
                            <ListItemText primary="Light" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disableGutters>
                        <ListItemButton onClick={() => handleChooseTheme('system')}>
                            <ListItemIcon>
                                <AutoMode />
                            </ListItemIcon>
                            <ListItemText primary="System" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Dialog>
        </>
    );
}
