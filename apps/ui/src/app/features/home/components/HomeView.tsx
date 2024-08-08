import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import ChannelCard from '../../channels/components/ChannelCard';
import { Channel } from '../../../types/channels/Channel';

type HomeViewProps = {
    channels: Channel[];
};

export default function HomeView({ channels }: HomeViewProps) {
    return (
        <Container>
            <Box display="flex" justifyContent="space-between" mb={4}>
                <TextField label="Filter..." variant="outlined" sx={{ width: '40%' }} />
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
