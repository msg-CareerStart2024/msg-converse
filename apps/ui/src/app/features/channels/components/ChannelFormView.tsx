import { Avatar, Box, Container, Grid, TextField } from '@mui/material';
import ActionButtonView from './ActionButtonView';
import { ACTION_TYPE, FormValues } from '../../../types/channel/channel.types';
import TopicsView from './TopicsView';
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { Topic } from '../../../types/channel/Topic';
import { ChannelFormValues } from '../../../types/channel/schemas/channel.schema';

type ChannelFormProps = {
    handleSubmit: UseFormHandleSubmit<ChannelFormValues>;
    register: UseFormRegister<ChannelFormValues>;
    errors: FieldErrors<FormValues>;
    isSubmitting: boolean;
    isEditForm: boolean;
    initialValues?: ChannelFormValues;
};

const topic1: Topic = {
    id: 'id1',
    name: 'name1'
};

const topic2: Topic = {
    id: 'id2',
    name: 'name2'
};

const topics: Topic[] = [topic1, topic2];
const userInitial = 'M';

export default function ChannelFormView({
    handleSubmit,
    register,
    errors,
    isSubmitting,
    isEditForm,
    initialValues
}: ChannelFormProps) {
    function onSubmit() {
        return;
    }

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 16, bgcolor: 'background.paper' }}>
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column' }}>
                <form>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'end',
                            gap: 2
                        }}
                    >
                        {isEditForm ? (
                            <>
                                <ActionButtonView
                                    action={ACTION_TYPE.delete}
                                    handleAction={handleSubmit(onSubmit)}
                                    isSubmitting={isSubmitting}
                                />
                                <ActionButtonView
                                    action={ACTION_TYPE.update}
                                    handleAction={handleSubmit(onSubmit)}
                                    isSubmitting={isSubmitting}
                                />
                            </>
                        ) : (
                            <ActionButtonView
                                action={ACTION_TYPE.create}
                                handleAction={handleSubmit(onSubmit)}
                                isSubmitting={isSubmitting}
                            />
                        )}
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
                                defaultValue={isEditForm ? initialValues?.name : ''}
                                focused
                                label="Channel Name"
                                variant="outlined"
                                {...register('name', {
                                    required: 'Channel name is required'
                                })}
                                error={!!errors.channelName}
                                helperText={errors.channelName?.message}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                defaultValue={isEditForm ? initialValues?.description : ''}
                                focused
                                label="Description"
                                variant="outlined"
                                {...register('description')}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        </Grid>
                        <TopicsView register={register} topics={topics} />
                    </Grid>
                </form>
            </Box>
        </Container>
    );
}
