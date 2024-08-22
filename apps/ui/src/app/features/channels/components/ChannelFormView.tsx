import { Avatar, Box, Container, Grid, Paper, TextField } from '@mui/material';
import {
    FieldErrors,
    UseFormGetValues,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormSetValue
} from 'react-hook-form';

import { getColor } from '../../../lib/avatar-colors';
import { CHANNEL_FORM_ACTION_TYPE } from '../../../types/channel/ChannelFormActionType.enums';
import { Topic } from '../../../types/channel/Topic.types';
import { User } from '../../../types/login/User.types';
import { UserRole } from '../../../types/login/UserRole.enum';
import { ChannelFormValues } from '../schemas/ChannelFormValues.schema';
import ActionButtonView from './ActionButtonView';
import TopicsView from './TopicsView';
import { Channel } from '../../../types/channel/channel.types';

type ChannelFormProps = {
    handleSubmit: UseFormHandleSubmit<ChannelFormValues>;
    register: UseFormRegister<ChannelFormValues>;
    errors: FieldErrors<ChannelFormValues>;
    isSubmitting: boolean;
    isValid: boolean;
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
    onCreate: () => void;
    onDelete: () => void;
    onUpdate: () => void;
    topics: Topic[];
    setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
    currentUser: User;
    handleAddTopic: () => void;
    handleDeleteTopic: (name: string) => void;
    data?: Channel;
    isChanged: boolean;
};

export default function ChannelFormView({
    handleSubmit,
    register,
    errors,
    isSubmitting,
    isValid,
    isEditForm,
    getValues,
    setValue,
    onCreate,
    onDelete,
    onUpdate,
    topics,
    setTopics,
    currentUser,
    handleAddTopic,
    handleDeleteTopic,
    data,
    isChanged
}: ChannelFormProps) {
    const channelName = data?.name;
    const channelInitial = getValues('name')?.charAt(0).toUpperCase();
    return (
        <Container
            component="main"
            maxWidth="lg"
            sx={{
                padding: 0.1
            }}
        >
            <Box sx={{ fontSize: '20px' }}>{isEditForm ? channelName : 'Create Channel'}</Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <form>
                    <Box
                        sx={{
                            marginTop: 5,
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
                                    handleAction={onDelete}
                                    disabled={isSubmitting || currentUser.role !== UserRole.ADMIN}
                                />
                                <ActionButtonView
                                    action={CHANNEL_FORM_ACTION_TYPE.UPDATE_CHANNEL}
                                    handleAction={handleSubmit(onUpdate)}
                                    disabled={
                                        isSubmitting ||
                                        !isValid ||
                                        !isChanged ||
                                        currentUser.role !== UserRole.ADMIN
                                    }
                                />
                            </>
                        ) : (
                            <ActionButtonView
                                action={CHANNEL_FORM_ACTION_TYPE.CREATE_CHANNEL}
                                handleAction={handleSubmit(onCreate)}
                                disabled={
                                    isSubmitting || !isValid || currentUser.role !== UserRole.ADMIN
                                }
                            />
                        )}
                    </Box>
                    <Paper elevation={0} variant="outlined" sx={{ padding: 5, pb: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, height: 64 }}>
                            {channelInitial && (
                                <Avatar
                                    sx={{
                                        bgcolor: getColor(channelInitial),
                                        width: 64,
                                        height: 64
                                    }}
                                >
                                    {channelInitial}
                                </Avatar>
                            )}
                        </Box>
                        <Grid container spacing={8} sx={{ marginBottom: 4 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    focused
                                    label="Channel Name"
                                    variant="outlined"
                                    color="secondary"
                                    {...register('name')}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    sx={{ '& label': { fontWeight: 'bold' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    focused
                                    label="Description"
                                    variant="outlined"
                                    color="secondary"
                                    {...register('description')}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                    sx={{ '& label': { fontWeight: 'bold' } }}
                                />
                            </Grid>
                            <TopicsView
                                register={register}
                                topics={topics}
                                getValues={getValues}
                                setTopics={setTopics}
                                setValue={setValue}
                                handleAddTopic={handleAddTopic}
                                handleDeleteTopic={handleDeleteTopic}
                            />
                        </Grid>
                    </Paper>
                </form>
            </Box>
        </Container>
    );
}
