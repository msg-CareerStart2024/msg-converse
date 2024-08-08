import { AddCircle, Cancel } from '@mui/icons-material';
import { Grid, TextField, IconButton, Box, Chip } from '@mui/material';
import { FormValues } from '../../../types/channel/channel.types';
import { UseFormRegister } from 'react-hook-form';

type TopicsViewProps = {
    register: UseFormRegister<FormValues>;
    topics: string[];
};

export default function TopicsView({ register, topics }: TopicsViewProps) {
    const handleAddTopic = () => {
        return;
    };

    const handleDeleteTopic = () => {
        return;
    };

    return (
        <>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    focused
                    variant="outlined"
                    label="Topics"
                    {...register('topics')}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <IconButton color="primary" onClick={handleAddTopic}>
                    <AddCircle sx={{ fontSize: 60, marginLeft: -6, marginTop: -1 }} />
                </IconButton>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: -4 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 2 }}>
                    {topics.map((topic, index) => (
                        <Chip
                            key={index}
                            label={topic}
                            color="primary"
                            onDelete={handleDeleteTopic}
                            deleteIcon={<Cancel />}
                        />
                    ))}
                </Box>
            </Grid>
        </>
    );
}
