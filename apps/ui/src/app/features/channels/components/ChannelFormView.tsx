import { Avatar, Box, Container, Grid, TextField } from '@mui/material';
import ActionButtonView from './ActionButtonView';
import TopicsView from './TopicsView';
import {
    FieldErrors,
    UseFormGetValues,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormSetValue
} from 'react-hook-form';
import { Topic } from '../../../types/channel/Topic.types';
import {
    useCreateChannelMutation,
    useDeleteChannelMutation,
    useUpdateChannelMutation
} from '../../../api/channels-api';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChannelFormValues } from '../schemas/ChannelFormValues.schema';
import { CHANNEL_FORM_ACTION_TYPE } from '../../../types/channel/ChannelFormActionType';

type ChannelFormProps = {
    handleSubmit: UseFormHandleSubmit<ChannelFormValues>;
    register: UseFormRegister<ChannelFormValues>;
    errors: FieldErrors<ChannelFormValues>;
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

    const { id } = useParams<{ id?: string }>();

    const navigate = useNavigate();

    const [createChannel] = useCreateChannelMutation();
    const [deleteChannel] = useDeleteChannelMutation();
    const [updateChannel] = useUpdateChannelMutation();

    function onCreate() {
        createChannel({
            name: getValues('name'),
            description: getValues('description'),
            topics: topics.map(topic => {
                return { name: topic.name };
            })
        })
            .unwrap()
            .then(newChannel => {
                alert('Channel created successfully');
                navigate('/');
            })
            .catch(error => {
                console.error('Failed to create channel:', error);
                alert('Failed to create channel');
            });
    }

    function onDelete() {
        const channelId = id;
        if (channelId) {
            deleteChannel(channelId)
                .unwrap()
                .then(() => {
                    alert('Channel successfully deleted');
                    navigate('/');
                })
                .catch(error => {
                    alert('Failed to delete channel');
                    console.error('Delete channel error:', error);
                });
        }
    }

    function onUpdate() {
        const channelData = {
            name: getValues('name'),
            description: getValues('description'),
            topics: topics.map(topic => ({
                name: topic.name
            }))
        };

        const channelId = id;
        if (channelId) {
            updateChannel({ id: channelId, partialChannel: channelData })
                .unwrap()
                .then(() => {
                    alert('Channel updated successfully');
                    navigate('/');
                })
                .catch(error => {
                    alert('Failed to update channel');
                    console.error('Update channel error:', error);
                });
        } else {
            alert('Channel ID is missing');
        }
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
                                    action={CHANNEL_FORM_ACTION_TYPE.DELETE_CHANNEL}
                                    handleAction={handleSubmit(onDelete)}
                                    isSubmitting={isSubmitting}
                                />
                                <ActionButtonView
                                    action={CHANNEL_FORM_ACTION_TYPE.UPDATE_CHANNEL}
                                    handleAction={handleSubmit(onUpdate)}
                                    isSubmitting={isSubmitting}
                                />
                            </>
                        ) : (
                            <ActionButtonView
                                action={CHANNEL_FORM_ACTION_TYPE.CREATE_CHANNEL}
                                handleAction={handleSubmit(onCreate)}
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
                                error={!!errors.name}
                                helperText={errors.name?.message}
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
