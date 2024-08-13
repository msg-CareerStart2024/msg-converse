import { useForm } from 'react-hook-form';
import ChannelFormView from '../components/ChannelFormView';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreateChannelMutation,
    useDeleteChannelMutation,
    useLazyGetChannelByIdQuery,
    useUpdateChannelMutation
} from '../../../api/channels-api';
import { Typography } from '@mui/material';

import { useEffect, useState } from 'react';
import { ChannelFormValues } from '../schemas/ChannelFormValues.schema';
import { RootState } from '../../../store/store';
import { useSelector } from 'react-redux';
import { User } from '../../../types/login/User';
import { Topic } from '../../../types/channel/Topic.types';

export default function ChannelPage() {
    const { id } = useParams<{ id?: string }>();
    const [getChannelById, { data }] = useLazyGetChannelByIdQuery();
    const [topics, setTopics] = useState<Topic[]>([]);

    const currentUser = useSelector((state: RootState) => state.auth.user) as User;

    const [createChannel] = useCreateChannelMutation();
    const onCreate = async () => {
        try {
            const name = getValues('name');
            const description = getValues('description');
            const topicsTransformed = topics.map(topic => ({ name: topic.name }));

            await createChannel({
                name: name,
                description: description,
                topics: topicsTransformed
            });

            alert('Channel created successfully');
            navigate('/');
        } catch (error) {
            console.error('Failed to create channel:', error);
            alert('Failed to create channel');
        }
    };

    const [deleteChannel] = useDeleteChannelMutation();
    const onDelete = async () => {
        const channelId = id;
        if (!channelId) {
            alert('Channel ID is missing');
            return;
        }

        try {
            await deleteChannel(channelId);

            alert('Channel successfully deleted');
            navigate('/');
        } catch (error) {
            console.error('Failed to delete channel:', error);
            alert('Failed to delete channel');
        }
    };

    const [updateChannel] = useUpdateChannelMutation();
    const onUpdate = async () => {
        const channelData = {
            name: getValues('name'),
            description: getValues('description'),
            topics: topics.map(topic => ({
                name: topic.name
            }))
        };

        const channelId = id;
        if (channelId) {
            try {
                await updateChannel({ id: channelId, partialChannel: channelData });
                alert('Channel updated successfully');
                navigate('/');
            } catch (error) {
                alert('Failed to update channel');
                console.error('Update channel error:', error);
            }
        } else {
            alert('Channel ID is missing');
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getChannelById(id);
        }
    }, [id, getChannelById]);

    const {
        handleSubmit,
        register,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<ChannelFormValues>({});

    useEffect(() => {
        if (data) {
            setValue('name', data.name);
            setValue('description', data.description);
            setTopics(data.topics);
        }
    }, [data, setValue]);

    if (id && !data) {
        return <Typography>Loading...</Typography>;
    }

    const handleAddTopic = () => {
        const newTopicName = getValues('topics');
        if (!newTopicName) return;

        const updatedTopics = topics.reduce<Topic[]>((acc, topic) => {
            if (topic.name !== newTopicName) {
                acc.push(topic);
            }
            return acc;
        }, []);

        if (updatedTopics.length === topics.length) {
            updatedTopics.push({ id: '', name: newTopicName });
        }

        setTopics(updatedTopics);
        setValue('topics', '');
    };

    const handleDeleteTopic = (name: string) => {
        const updatedTopics = topics.filter(topic => topic.name !== name);
        setTopics(updatedTopics);
    };

    return (
        <ChannelFormView
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            isSubmitting={false}
            isEditForm={!!id}
            getValues={getValues}
            setValue={setValue}
            onCreate={onCreate}
            onDelete={onDelete}
            onUpdate={onUpdate}
            topics={topics}
            setTopics={setTopics}
            currentUser={currentUser}
            handleAddTopic={handleAddTopic}
            handleDeleteTopic={handleDeleteTopic}
        />
    );
}
