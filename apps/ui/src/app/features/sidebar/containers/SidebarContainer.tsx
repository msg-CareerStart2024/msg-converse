import { useState } from 'react';
import SidebarView from '../components/SidebarView';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

type SidebarContainerProps = {
    toggleSidebar: () => void;
    sidebarOpen: boolean;
};

export default function SidebarContainer({ toggleSidebar, sidebarOpen }: SidebarContainerProps) {
    const [anchorElelement, setAnchorElelement] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorElelement);
    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorElelement(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorElelement(null);
    };
    const channels = useSelector((state: RootState) => state.channels);

    return (
        <SidebarView
            menuOpen={menuOpen}
            anchorElelement={anchorElelement}
            handleClick={handleClick}
            handleClose={handleClose}
            channels={channels}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
        />
    );
}
