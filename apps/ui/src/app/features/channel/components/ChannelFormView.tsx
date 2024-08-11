import { useRef } from 'react';
import { Avatar, Box, Container, Grid, TextField } from '@mui/material';
import ActionButton from './ActionButtonView';
import TopicsView from './TopicsView';
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { FormValues } from '../../../types/channel/FormValues';

export type ChannelFormProps = {
    handleSubmit: UseFormHandleSubmit<FormValues>;
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    isSubmitting: boolean;
    isEditForm: boolean;
    onSubmit: () => void;
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
    onSubmit,
    initialValues
}: ChannelFormProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleCreateOrUpdate = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ mt: 16, bgcolor: 'background.paper' }}>
            <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column' }}>
                <Box
                    component="form"
                    ref={formRef}
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ width: '100%' }}
                >
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
                                    handleAction={() => onSubmit()}
                                    isSubmitting={isSubmitting}
                                />
                                <ActionButton
                                    action="update"
                                    handleAction={handleCreateOrUpdate}
                                    isSubmitting={isSubmitting}
                                />
                            </>
                        ) : (
                            <ActionButton
                                action="create"
                                handleAction={handleCreateOrUpdate}
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
                                focused
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
                                focused
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
