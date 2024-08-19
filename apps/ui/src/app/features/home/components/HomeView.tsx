import { Box, Button, Container, Grid, Typography } from '@mui/material';
<<<<<<< HEAD
import ChannelCard from '../../channels/components/ChannelCard';
import { Channel } from '../../../types/channel/channel.types';

import SearchBar from '../../../components/SearchBar';
import { Link } from 'react-router-dom';
=======
import { Channel } from '../../../types/channel/channel.types';
import ChannelCard from '../../channels/components/ChannelCard';

import { useSelector } from 'react-redux';
import SearchBar from '../../../components/SearchBar';
import { RootState } from '../../../store/store';
import { UserRole } from '../../../types/login/UserRole.enum';
>>>>>>> main

type HomeViewProps = {
    channels: Channel[] | undefined;
    onSearch: (query: string) => void;
    handleNavigateToCreateChannel: () => void;
};

export default function HomeView({
    channels,
    onSearch,
    handleNavigateToCreateChannel
}: HomeViewProps) {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" mb={4}>
                <Box
                    sx={{
                        width: {
                            xs: '70%',
                            md: '40%'
                        }
                    }}
                >
                    <SearchBar onSearch={onSearch} />
                </Box>
<<<<<<< HEAD
                <Link to="/channels/new">
                    <Button variant="contained" color="primary">
                        CREATE CHANNEL
                    </Button>
                </Link>
=======
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNavigateToCreateChannel}
                    disabled={user?.role !== UserRole.ADMIN}
                >
                    CREATE CHANNEL
                </Button>
>>>>>>> main
            </Box>

            <Grid container spacing={3} alignItems="stretch">
                {channels?.map(channel => (
                    <Grid item key={channel.id} xs={4}>
                        <ChannelCard channel={channel} />
                    </Grid>
                ))}
            </Grid>

            {channels?.length === 0 && (
                <Typography variant="h5" sx={{ marginY: 5 }}>
                    No channels found!
                </Typography>
            )}
        </Container>
    );
}
