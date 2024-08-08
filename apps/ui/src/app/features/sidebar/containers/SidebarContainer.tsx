import { useState } from 'react';
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
    const [anchorElelement, setAnchorElelement] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorElelement);
    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorElelement(event.currentTarget);
    };
    const navigate = useNavigate();
    const handleClose = () => {
        store.dispatch(clearCredentials());
        navigate('/login');
    };
    const channels = useSelector((state: RootState) => state.channels);

    return (
        <SidebarView
            open={open}
            anchorElelement={anchorElelement}
            handleClick={handleClick}
            handleClose={handleClose}
            channels={channels}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
        />
    );
}
