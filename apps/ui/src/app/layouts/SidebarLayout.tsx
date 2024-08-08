import { Container, Grid, IconButton, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarContainer from '../features/sidebar/containers/SidebarContainer';
import { useState } from 'react';
import { ChevronRight } from '@mui/icons-material';

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
                        <Container>
                            <Typography variant="h4" component="h1" gutterBottom sx={{ my: 3 }}>
                                Msg. Converse
                            </Typography>
                        </Container>
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
                    <Container>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ my: 3 }}>
                            Msg. Converse
                        </Typography>
                    </Container>
                    <Outlet />
                </>
            )}
        </div>
    );
}
