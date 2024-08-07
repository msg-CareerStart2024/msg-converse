import { Box, Button, Container, TextField, Typography } from '@mui/material';
import ChannelCard from '../../channels/components/ChannelCard';
import { Channel } from '../../../types/channels/Channel';

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
                <TextField label="Filter..." variant="outlined" sx={{ width: '40%' }} />
                <Button variant="contained" color="primary">
                    CREATE CHANNEL
                </Button>
            </Box>

            <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
                {channels.map(channel => (
                    <ChannelCard key={channel.id} channel={channel} />
                ))}
            </Box>
        </Container>
    );
}
