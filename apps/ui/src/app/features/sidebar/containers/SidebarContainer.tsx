import { Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetJoinedChannelsQuery } from '../../../api/channels-api/channels-api';
import { store } from '../../../store/store';
import { clearCredentials } from '../../login/slices/auth-slice';
import SidebarView from '../components/SidebarView';

type SidebarContainerProps = {
    toggleSidebar: () => void;
    sidebarOpen: boolean;
};

export default function SidebarContainer({ toggleSidebar, sidebarOpen }: SidebarContainerProps) {
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorElement);
    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorElement(event.currentTarget);
    };
    const navigate = useNavigate();
    const handleClose = () => {
        setAnchorElement(null);
    };
    const handleLogout = () => {
        handleClose();
        store.dispatch(clearCredentials());
        navigate('/login');
    };

    const { data: joinedChannels, isLoading } = useGetJoinedChannelsQuery();

    if (isLoading) {
        return <Typography>My channels are loading..</Typography>;
    }

    return (
        <SidebarView
            menuOpen={menuOpen}
            anchorElement={anchorElement}
            handleClick={handleClick}
            handleClose={handleClose}
            handleLogout={handleLogout}
            channels={joinedChannels}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
        />
    );
}
