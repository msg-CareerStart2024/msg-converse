import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import ChannelFormView from '../components/ChannelFormView';
import {
    useCreateChannelMutation,
    useDeleteChannelMutation,
    useLazyGetChannelByIdQuery,
    useUpdateChannelMutation
} from '../../../api/channels-api';
import { Typography } from '@mui/material';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { Topic } from '../../../types/channel/Topic.types';
import { User } from '../../../types/login/User.types';
import { ChannelFormSchema, ChannelFormValues } from '../schemas/ChannelFormValues.schema';

export default function ChannelPage() {
    const { id } = useParams<{ id?: string }>();
    const [getChannelById, { data }] = useLazyGetChannelByIdQuery();
    const [topics, setTopics] = useState<Topic[]>([]);

    const currentUser = useSelector((state: RootState) => state.auth.user) as User;

    const [createChannel] = useCreateChannelMutation();
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

    const [deleteChannel] = useDeleteChannelMutation();
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

    const [updateChannel] = useUpdateChannelMutation();
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
    } = useForm<ChannelFormValues>({
        resolver: zodResolver(ChannelFormSchema)
    });

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

        if (!updatedTopics.includes({ name: newTopicName, id: '' })) {
            updatedTopics.push({ name: newTopicName, id: '' });
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
