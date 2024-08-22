import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCreateChannelMutation,
    useDeleteChannelMutation,
    useLazyGetChannelByIdQuery,
    useUpdateChannelMutation
} from '../../../api/channels-api/channels-api';
import { RootState } from '../../../store/store';
import { Topic } from '../../../types/channel/Topic.types';
import { User } from '../../../types/login/User.types';
import { capitalizeFirstLetter } from '../../../utils/utils';
import ChannelFormView from '../components/ChannelFormView';
import { ChannelFormSchema, ChannelFormValues } from '../schemas/ChannelFormValues.schema';
import toast from 'react-hot-toast';
import { ChannelDTO } from '../../../types/channel/channel.types';

export default function ChannelFormPage() {
    const { id } = useParams<{ id?: string }>();
    const [getChannelById, { data }] = useLazyGetChannelByIdQuery();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [initialValues, setInitialValues] = useState<ChannelDTO | null>(null);
    const currentUser = useSelector((state: RootState) => state.auth.user) as User;
    const isChangedRef = useRef(false);
    const [isChanged, setIsChanged] = useState(false);

    interface SimpleTopic {
        name: string;
    }

    const areTopicsEqual = useCallback((topics1: Topic[], topics2: SimpleTopic[]): boolean => {
        const topicNames1 = topics1.map(t => t.name).sort();
        const topicNames2 = topics2.map(t => t.name).sort();

        if (topicNames1.length !== topicNames2.length) return false;

        return topicNames1.every((name, index) => name === topicNames2[index]);
    }, []);

    const [createChannel] = useCreateChannelMutation();
    function onCreate() {
        if (topics.length === 0) {
            toast.error('Please add at least one topic before creating the channel.');
            return;
        }

        createChannel({
            name: capitalizeFirstLetter(getValues('name')).trim(),
            description: getValues('description'),
            topics: topics.map(topic => {
                return { name: topic.name };
            })
        })
            .unwrap()
            .then(newChannel => {
                toast.success('Channel created successfully.');
                navigate('/');
            })
            .catch(error => {
                toast.error('Failed to create the channel.');
            });
    }

    const [deleteChannel] = useDeleteChannelMutation();
    function onDelete() {
        const channelId = id;
        if (channelId) {
            deleteChannel(channelId)
                .unwrap()
                .then(() => {
                    toast.success('Channel deleted successfully.');
                    navigate('/');
                })
                .catch(error => {
                    toast.error('Failed to delete channel.');
                });
        }
    }

    const [updateChannel] = useUpdateChannelMutation();
    function onUpdate() {
        const channelData = {
            name: capitalizeFirstLetter(getValues('name')).trim(),
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
                    toast.success('Channel updated successfully.');
                    navigate('/');
                })
                .catch(error => {
                    toast.error('Failed to update the channel.');
                });
        } else {
            toast.error('Channel ID is missing');
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
        watch,
        formState: { errors, isValid }
    } = useForm<ChannelFormValues>({
        resolver: zodResolver(ChannelFormSchema),
        mode: 'onChange',
        defaultValues: {
            name: data?.name,
            description: data?.description,
            topics: data?.topics.map(t => t.name).join(', ')
        }
    });

    useEffect(() => {
        if (data) {
            setInitialValues({
                name: data.name,
                description: data.description,
                topics: data.topics
            });
            setValue('name', data.name);
            setValue('description', data.description);
            setTopics(data.topics);
        }
    }, [data, setValue]);

    const nameValue = watch('name');
    const descriptionValue = watch('description');

    useEffect(() => {
        if (initialValues) {
            const topicsChanged = !areTopicsEqual(topics, initialValues.topics);
            isChangedRef.current =
                initialValues.name !== nameValue ||
                initialValues.description !== descriptionValue ||
                topicsChanged;
            setIsChanged(isChangedRef.current);
        }
    }, [nameValue, descriptionValue, initialValues, areTopicsEqual, topics]);

    const handleAddTopic = () => {
        const newTopicName = getValues('topics').toUpperCase().trim();
        if (!newTopicName) return;

        const updatedTopics = topics.reduce<Topic[]>((acc, topic) => {
            if (topic.name !== newTopicName) {
                acc.push(topic);
            }
            return acc;
        }, []);

        if (!updatedTopics.includes({ name: newTopicName, id: '' }) && newTopicName !== '') {
            updatedTopics.push({ name: newTopicName, id: '' });
        }

        setTopics(updatedTopics);
        setValue('topics', '');
    };

    const handleDeleteTopic = (name: string) => {
        const updatedTopics = topics.filter(topic => topic.name !== name);
        setTopics(updatedTopics);
    };

    if (id && !data) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <ChannelFormView
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            isSubmitting={false}
            isValid={isValid}
            isEditForm={!!id}
            getValues={getValues}
            setValue={setValue}
            data={data}
            onCreate={onCreate}
            onDelete={onDelete}
            onUpdate={onUpdate}
            topics={topics}
            setTopics={setTopics}
            currentUser={currentUser}
            handleAddTopic={handleAddTopic}
            handleDeleteTopic={handleDeleteTopic}
            isChanged={isChanged}
        />
    );
}
