import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetJoinedChannelsQuery } from '../../../api/channels-api/channels-api';
import { AppDispatch, store } from '../../../store/store';
import { setChannels } from '../../channels/slices/channels-slice';
import { clearCredentials } from '../../login/slices/auth-slice';
import SidebarView from '../components/SidebarView';
import { setTheme } from '../slices/theme-slice';

type SidebarContainerProps = {
    toggleSidebar: () => void;
    sidebarOpen: boolean;
};

export default function SidebarContainer({ toggleSidebar, sidebarOpen }: SidebarContainerProps) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

    const menuOpen = Boolean(anchorElement);

    const handleMenuOpen = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorElement(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorElement(null);
    };

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleChooseTheme = (theme: 'dark' | 'light' | 'system') => {
        dispatch(setTheme(theme));
        handleDialogClose();
        handleMenuClose();
    };

    const handleLogout = () => {
        handleDialogClose();
        handleMenuClose();
        store.dispatch(clearCredentials());
        navigate('/login');
    };
    const { data: joinedChannels, isLoading } = useGetJoinedChannelsQuery();

    useEffect(() => {
        joinedChannels && store.dispatch(setChannels(joinedChannels));
    }, [joinedChannels]);

    if (isLoading) {
        return <Typography>My channels are loading..</Typography>;
    }

    return (
        <SidebarView
            menuOpen={menuOpen}
            anchorElement={anchorElement}
            handleMenuOpen={handleMenuOpen}
            handleMenuClose={handleMenuClose}
            handleLogout={handleLogout}
            channels={joinedChannels}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            handleChooseTheme={handleChooseTheme}
            handleDialogOpen={handleDialogOpen}
            handleDialogClose={handleDialogClose}
            dialogOpen={dialogOpen}
        />
    );
}
