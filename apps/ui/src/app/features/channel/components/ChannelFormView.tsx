import { Avatar, Box, Container, Grid, TextField } from '@mui/material';
import ActionButton from './ActionButtonView';
import TopicsView from './TopicsView';
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { FormValues } from '../../../types/channel/FormValues';

function onSubmit() {
    return;
}

export type ChannelFormProps = {
    handleSubmit: UseFormHandleSubmit<FormValues>;
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    isSubmitting: boolean;
    isEditForm: boolean;
    initialValues?: FormValues;
};

const topics = ['Topic 1', 'Topic 2', 'Topic 3'];
const userInitial = 'L';

export default function ChannelFormView({
    handleSubmit,
    register,
    errors,
    isSubmitting,
    isEditForm,
    initialValues
}: ChannelFormProps) {
    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 16, bgcolor: 'background.paper' }}>
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column' }}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
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
                                <ActionButton
                                    action="delete"
                                    handleAction={handleSubmit(onSubmit)}
                                    isSubmitting={isSubmitting}
                                />
                                <ActionButton
                                    action="update"
                                    handleAction={handleSubmit(onSubmit)}
                                    isSubmitting={isSubmitting}
                                />
                            </>
                        ) : (
                            <ActionButton
                                action="create"
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
                                defaultValue={isEditForm ? initialValues?.channelName : ''}
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
                                defaultValue={isEditForm ? initialValues?.description : ''}
                                label="Description"
                                variant="outlined"
                                {...register('description')}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        </Grid>
                        <TopicsView register={register} topics={topics} />
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
