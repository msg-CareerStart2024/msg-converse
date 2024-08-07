import { AddCircle, Cancel } from '@mui/icons-material';
import { Avatar, Box, Button, Chip, Container, Grid, IconButton, TextField } from '@mui/material';
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

type FormValues = {
    channelName: string;
    description: string;
    topics: string[];
};

type ChannelFormProps = {
    handleSubmit: UseFormHandleSubmit<FormValues>;
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    isSubmitting: boolean;
};

function handleAddTopic() {
    return;
}

function handleDelete() {
    return;
}

function onSubmit() {
    return;
}

const topics = ['Topic 1', 'Topic 2', 'Topic 3'];
const userInitial = 'M';

export default function ChannelFormView({
    handleSubmit,
    register,
    errors,
    isSubmitting
}: ChannelFormProps) {
    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 16, bgcolor: 'background.paper' }}>
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column' }}>
                <form>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 8 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit(onSubmit)}
                            sx={{
                                width: 'fit-content',
                                alignSelf: 'flex-end',
                                bgcolor: 'primary.main',
                                '&:hover': { bgcolor: 'primary.dark' }
                            }}
                        >
                            Create
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
                        <Avatar sx={{ bgcolor: 'gray', width: 64, height: 64 }}>
                            {userInitial}
                        </Avatar>
                    </Box>
                    <Grid container spacing={8} sx={{ marginBottom: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                focused
                                label="Channel Name"
                                variant="outlined"
                                {...register('channelName', {
                                    required: 'Channel name is required'
                                })}
                                error={!!errors.channelName}
                                helperText={errors.channelName?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                focused
                                label="Description"
                                variant="outlined"
                                {...register('description')}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        </Grid>
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
                    </Grid>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 4 }}>
                        {topics.map((topic, index) => (
                            <Chip
                                key={index}
                                label={topic}
                                color="primary"
                                onDelete={handleDelete}
                                deleteIcon={<Cancel />}
                            />
                        ))}
                    </Box>
                </form>
            </Box>
        </Container>
    );
}
