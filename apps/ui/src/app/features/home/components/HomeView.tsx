import { Box, Button, Container, Grid, Typography } from '@mui/material';
import ChannelCard from '../../channels/components/ChannelCard';
import { Channel } from '../../../types/channel/channel.types';

import SearchBar from '../../../components/SearchBar';
import { Link } from 'react-router-dom';

type HomeViewProps = {
    channels: Channel[] | undefined;
    onSearch: (query: string) => void;
};

export default function HomeView({ channels, onSearch }: HomeViewProps) {
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
                <Link to="/channels/new">
                    <Button variant="contained" color="primary">
                        CREATE CHANNEL
                    </Button>
                </Link>
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
