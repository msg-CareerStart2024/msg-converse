import { useState } from 'react';
import SidebarView from '../components/SidebarView';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

export default function SidebarContainer() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const channels = useSelector((state: RootState) => state.channels);

    return (
        <SidebarView
            open={open}
            anchorEl={anchorEl}
            handleClick={handleClick}
            handleClose={handleClose}
            channels={channels}
        />
    );
}
