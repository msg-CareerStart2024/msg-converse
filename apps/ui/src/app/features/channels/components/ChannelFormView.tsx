import { Avatar, Box, Container, Grid, TextField } from '@mui/material';
import {
    FieldErrors,
    UseFormGetValues,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormSetValue
} from 'react-hook-form';

import ActionButtonView from './ActionButtonView';
import { CHANNEL_FORM_ACTION_TYPE } from '../../../types/channel/ChannelFormActionType.enums';
import { ChannelFormValues } from '../schemas/ChannelFormValues.schema';
import { Topic } from '../../../types/channel/Topic.types';
import TopicsView from './TopicsView';
import { User } from '../../../types/login/User.types';
import { UserRole } from '../../../types/login/UserRole.enum';

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
    onCreate: () => void;
    onDelete: () => void;
    onUpdate: () => void;
    topics: Topic[];
    setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
    currentUser: User;
    handleAddTopic: () => void;
    handleDeleteTopic: (name: string) => void;
};

export default function ChannelFormView({
    handleSubmit,
    register,
    errors,
    isSubmitting,
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
    handleDeleteTopic
}: ChannelFormProps) {
    const channelName = getValues('name');
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
                                    handleAction={handleSubmit(onDelete)}
                                    disabled={isSubmitting || currentUser.role !== UserRole.ADMIN}
                                />
                                <ActionButtonView
                                    action={CHANNEL_FORM_ACTION_TYPE.UPDATE_CHANNEL}
                                    handleAction={handleSubmit(onUpdate)}
                                    disabled={isSubmitting || currentUser.role !== UserRole.ADMIN}
                                />
                            </>
                        ) : (
                            <ActionButtonView
                                action={CHANNEL_FORM_ACTION_TYPE.CREATE_CHANNEL}
                                handleAction={handleSubmit(onCreate)}
                                disabled={isSubmitting || currentUser.role !== UserRole.ADMIN}
                            />
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 4 }}>
                        <Avatar sx={{ bgcolor: 'gray', width: 64, height: 64 }}>
                            {currentUser.firstName[0].toUpperCase()}
                        </Avatar>
                    </Box>
                    <Grid container spacing={8} sx={{ marginBottom: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                focused
                                label="Channel Name"
                                variant="outlined"
                                {...register('name')}
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
                            handleAddTopic={handleAddTopic}
                            handleDeleteTopic={handleDeleteTopic}
                        />
                    </Grid>
                </form>
            </Box>
        </Container>
    );
}
