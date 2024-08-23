import { AddCircle, Cancel } from '@mui/icons-material';
import { Autocomplete, Box, Chip, Grid, IconButton, TextField } from '@mui/material';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Topic } from '../../../types/channel/Topic.types';
import { ChannelFormValues } from '../schemas/ChannelFormValues.schema';

type TopicsViewProps = {
    register: UseFormRegister<ChannelFormValues>;
    topics: Topic[];
    getValues: UseFormGetValues<{
        name: string;
        topics: string;
        description: string;
    }>;
    setValue: UseFormSetValue<{
        name: string;
        description: string;
        topics: string;
    }>;
    setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
    handleAddTopic: () => void;
    handleDeleteTopic: (name: string) => void;
    isTotalTopics: string[];
};

export default function TopicsView({
    register,
    topics,
    handleAddTopic,
    handleDeleteTopic,
    isTotalTopics,
    setValue
}: TopicsViewProps) {
    return (
        <>
            <Grid item xs={12} sm={6}>
                <Autocomplete
                    freeSolo
                    options={isTotalTopics}
                    renderInput={params => (
                        <TextField
                            {...params}
                            fullWidth
                            focused
                            variant="outlined"
                            color="secondary"
                            label="Topics"
                            {...register('topics')}
                            onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
                            sx={{ '& label': { fontWeight: 'bold' } }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <IconButton
                    color="secondary"
                    onClick={handleAddTopic}
                    sx={{
                        marginLeft: -6,
                        marginTop: -1
                    }}
                >
                    <AddCircle sx={{ fontSize: 60 }} />
                </IconButton>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ marginTop: -4 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 2 }}>
                    {topics.map((topic, index) => (
                        <Chip
                            key={index}
                            label={topic.name}
                            color="secondary"
                            onDelete={() => handleDeleteTopic(topic.name)}
                            deleteIcon={<Cancel />}
                        />
                    ))}
                </Box>
            </Grid>
        </>
    );
}
