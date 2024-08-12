import { ChevronRight } from '@mui/icons-material';
import { useState } from 'react';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarContainer from '../features/sidebar/containers/SidebarContainer';

export default function ProtectedLayout() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <SidebarContainer toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <Box
                sx={{
                    marginLeft: sidebarOpen ? '16.666667%' : '0',
                    width: sidebarOpen ? '83.33333%' : '100%',
                    transition: 'margin-left 0.225s ease, width 0.225s ease'
                }}
            >
                <Container>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ my: 3 }}>
                        Msg. Converse
                    </Typography>
                </Container>
                <Outlet />
            </Box>
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
        </>
    );
}
