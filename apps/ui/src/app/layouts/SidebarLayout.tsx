import { ChevronRight } from '@mui/icons-material';
import { Grid, IconButton } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarContainer from '../features/sidebar/containers/SidebarContainer';

export default function ProtectedLayout() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div>
            {sidebarOpen ? (
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <SidebarContainer toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
                    </Grid>
                    <Grid item xs={10}>
                        <Outlet />
                    </Grid>
                </Grid>
            ) : (
                <>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleSidebar}
                        edge="start"
                        sx={{
                            position: 'absolute !important',
                            top: '50%',
                            left: '12px',
                            transform: 'translateY(-50%)'
                        }}
                    >
                        <ChevronRight />
                    </IconButton>
                    <Outlet />
                </>
            )}
        </div>
    );
}
