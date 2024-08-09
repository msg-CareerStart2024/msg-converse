import { useForm } from 'react-hook-form';
import ChannelFormView from '../components/ChannelFormView';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelFormValues, channelSchema } from '../../../types/channels/schemas/channel.schema';
import React from 'react';

export default function ChannelPage() {
    const channelData = {
        channelName: 'Example Channel',
        topics: []
    };

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<ChannelFormValues>({
        resolver: zodResolver(channelSchema),
        defaultValues: channelData || {}
    });

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
