import { useForm } from 'react-hook-form';
import ChannelFormView from '../components/ChannelFormView';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';
import { useLazyGetChannelByIdQuery } from '../../../api/channelsApi';
import { Typography } from '@mui/material';
import { ChannelFormValues, channelSchema } from '../../../types/channel/schemas/channel.schema';
import { useEffect } from 'react';

export default function ChannelPage() {
    const { id } = useParams<{ id?: string }>();
    const [getChannelById, { data }] = useLazyGetChannelByIdQuery();

    console.log(id);

    useEffect(() => {
        if (id) {
            console.log('Fetching channel data for ID:', id);
            getChannelById(id);
        }
    }, [id, getChannelById]);

    // const channelData = data as Channel;

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm<ChannelFormValues>({
        resolver: zodResolver(channelSchema)
        // defaultValues: {
        //     name: channelData?.name ?? '',
        //     description: channelData?.description ?? '',
        //     topics: channelData?.topics ?? []
        // }
    });

    useEffect(() => {
        if (data) {
            console.log('data has arrived');
            setValue('name', data.name);
            setValue('description', data.description);
            setValue('topics', data.topics);
        }
    }, [data, setValue]);

    if (id && !data) {
        console.log('Data is still fetching...');
        return <Typography>Loading...</Typography>;
    }

    console.log('Form errors:', errors);

    return (
        <ChannelFormView
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            isSubmitting={false}
            isEditForm={!!id}
            initialValues={data}
        />
    );
}
