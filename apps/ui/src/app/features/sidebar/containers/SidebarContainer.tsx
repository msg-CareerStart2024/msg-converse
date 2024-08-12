import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, store } from '../../../store/store';
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
    const channels = useSelector((state: RootState) => state.channels);

    return (
        <SidebarView
            menuOpen={menuOpen}
            anchorElement={anchorElement}
            handleClick={handleClick}
            handleClose={handleClose}
            handleLogout={handleLogout}
            channels={channels}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
        />
    );
}
