import { useForm } from 'react-hook-form';
import ChannelFormView from '../components/ChannelFormView';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { ChannelFormValues, channelSchema } from '../../../types/channels/schemas/channel.schema';
import React from 'react';

export default function ChannelPage() {
    const [channelData, setChannelData] = useState<ChannelFormValues | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            setChannelData({
                channelName: 'Example Channel',
                topics: []
            });
        };
        fetchData();
    }, []);

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<ChannelFormValues>({
        resolver: zodResolver(channelSchema),
        defaultValues: channelData || {}
    });

    if (!channelData) {
        return <div>Loading...</div>;
    }

    return (
        <ChannelFormView
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            isSubmitting={false}
            isEditForm={false}
            initialValues={channelData}
        />
    );
}
