import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    IconButton,
    Stack,
    Typography
} from '@mui/material';
import { Channel } from '../../../types/channels/Channel';
import { formatDate, shrinkToWords } from '../../../utils/utils';
import { getColor } from '../../../lib/avatar-colors';

interface ChannelCardProps {
    channel: Channel;
}
const ChannelCard = ({ channel }: ChannelCardProps) => {
    return (
        <Card
            sx={{
                boxShadow: theme => theme.customShadows.light,
                maxWidth: '33%',
                bgcolor: 'background.paper',
                color: 'text.primary'
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    mb={1.5}
                    justifyContent={'space-between'}
                    alignItems="flex-start"
                    gap={1.5}
                >
                    <Stack direction="row" gap={1.5}>
                        <Avatar sx={{ bgcolor: getColor(channel.name.charAt(0).toUpperCase()) }}>
                            {channel.name[0]}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" component="div">
                                {channel.name}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} gutterBottom>
                                {formatDate(channel.createdAt)}
                            </Typography>
                        </Box>
                    </Stack>
                    <IconButton aria-label="edit">
                        <EditIcon sx={{ color: 'text.secondary' }} />
                    </IconButton>
                </Stack>
                <Stack direction="row" spacing={1} mb={2}>
                    {channel.topics.map(topic => (
                        <Chip
                            key={topic.id}
                            label={topic.name}
                            sx={{ bgcolor: 'secondary.main', color: 'white' }}
                            size="small"
                        ></Chip>
                    ))}
                </Stack>
                <Typography variant="body2">{shrinkToWords(channel.description, 20)}</Typography>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <Button size="small" sx={{ color: 'secondary.main', fontWeight: '600' }}>
                    Join
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{
                        fontWeight: '600',
                        bgcolor: 'secondary.main',
                        '&:hover': {
                            bgcolor: 'secondary.dark'
                        }
                    }}
                >
                    Message
                </Button>
            </CardActions>
        </Card>
    );
};

export default ChannelCard;