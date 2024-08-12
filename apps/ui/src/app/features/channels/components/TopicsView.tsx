import { AddCircle, Cancel } from '@mui/icons-material';
import { Grid, TextField, IconButton, Box, Chip } from '@mui/material';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Topic } from '../../../types/channel/Topic';
import { ChannelFormValues } from '../../../types/channel/schemas/channel.schema';

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
};

export default function TopicsView({
    register,
    topics,
    getValues,
    setTopics,
    setValue
}: TopicsViewProps) {
    const handleAddTopic = () => {
        const tempTopics = [...topics];
        if (!tempTopics.find(topic => topic.name === getValues('topics'))) {
            tempTopics.push({
                id: '',
                name: getValues('topics')
            });
            setTopics(tempTopics);
        }
        setValue('topics', '');
    };

    const handleDeleteTopic = (name: string) => {
        const tempTopics = [...topics];
        const topic = tempTopics.find(topic => topic.name === name);
        if (topic) {
            tempTopics.splice(tempTopics.indexOf(topic), 1);
            setTopics(tempTopics);
        }
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
                            label={topic.name}
                            color="primary"
                            onDelete={() => handleDeleteTopic(topic.name)}
                            deleteIcon={<Cancel />}
                        />
                    ))}
                </Box>
            </Grid>
        </>
    );
}
