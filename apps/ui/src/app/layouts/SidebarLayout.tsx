import { Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SidebarContainer from '../features/sidebar/containers/SidebarContainer';

export default function ProtectedLayout() {
    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <SidebarContainer />
            </Grid>
            <Grid item xs={10}>
                <Outlet />
            </Grid>
        </Grid>
    );
}
