import { Grid, IconButton } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarContainer from '../features/sidebar/containers/SidebarContainer';
import { useState } from 'react';
import { ChevronRight } from '@mui/icons-material';
import styles from '../features/sidebar/styles/SidebarView.module.css';

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
                        className={styles.openButton}
                    >
                        <ChevronRight />
                    </IconButton>
                    <Outlet />
                </>
            )}
        </div>
    );
}
