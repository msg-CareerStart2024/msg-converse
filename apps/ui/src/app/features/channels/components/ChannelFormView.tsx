import { Avatar, Box, Container, Grid, TextField } from '@mui/material';
import ActionButtonView from './ActionButtonView';
import { ACTION_TYPE, FormValues } from '../../../types/channel/channel.types';
import TopicsView from './TopicsView';
import {
    FieldErrors,
    UseFormGetValues,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormSetValue
} from 'react-hook-form';
import { Topic } from '../../../types/channel/Topic';
import { ChannelFormValues } from '../../../types/channel/schemas/channel.schema';
import { useCreateChannelMutation } from '../../../api/channelsApi';
import { useState } from 'react';

type ChannelFormProps = {
    handleSubmit: UseFormHandleSubmit<ChannelFormValues>;
    register: UseFormRegister<ChannelFormValues>;
    errors: FieldErrors<FormValues>;
    isSubmitting: boolean;
    isEditForm: boolean;
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
};

const topic1: Topic = {
    id: 'id1',
    name: 'name1'
};

const topic2: Topic = {
    id: 'id2',
    name: 'name2'
};

const userInitial = 'M';

export default function ChannelFormView({
    handleSubmit,
    register,
    errors,
    isSubmitting,
    isEditForm,
    getValues,
    setValue
}: ChannelFormProps) {
    const [topics, setTopics] = useState<Topic[]>([topic1, topic2]);

    const [createChannel] = useCreateChannelMutation();

    function onSubmit() {
        createChannel({
            name: getValues('name'),
            description: getValues('description'),
            topics: topics.map(topic => topic.name)
        });
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
                                focused
                                label="Description"
                                variant="outlined"
                                {...register('description')}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        </Grid>
                        <TopicsView
                            register={register}
                            topics={topics}
                            getValues={getValues}
                            setTopics={setTopics}
                            setValue={setValue}
                        />
                    </Grid>
                </form>
            </Box>
        </Container>
    );
}
