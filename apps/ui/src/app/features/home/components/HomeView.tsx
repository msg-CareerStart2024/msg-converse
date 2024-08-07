import { Box, Button, Container, Grid, Typography } from '@mui/material';
import ChannelCard from '../../channels/components/ChannelCard';
import { Channel } from '../../../types/channels/Channel';
import SearchBar from '../../../components/SearchBar';

type HomeViewProps = {
    channels: Channel[];
};

export default function HomeView({ channels }: HomeViewProps) {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom sx={{ my: 5 }}>
                Msg. Converse
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={4}>
                <Box
                    sx={{
                        width: {
                            xs: '70%',
                            md: '40%'
                        }
                    }}
                >
                    <SearchBar />
                </Box>
                <Button variant="contained" color="primary">
                    CREATE CHANNEL
                </Button>
            </Box>

            <Grid container spacing={3} alignItems="stretch">
                {channels.map(channel => (
                    <Grid item key={channel.id} xs={4}>
                        <ChannelCard channel={channel} />
                    </Grid>
                ))}
            </Grid>

            {channels.length === 0 && (
                <Typography variant="h5" sx={{ marginY: 5 }}>
                    There are no channels!
                </Typography>
            )}
        </Container>
    );
}
