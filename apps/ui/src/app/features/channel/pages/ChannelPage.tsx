import { useForm } from 'react-hook-form';
import ChannelFormView from '../components/ChannelFormView';
import { ChannelFormValues, channelSchema } from '../../../types/channel/channel.types';
import { zodResolver } from '@hookform/resolvers/zod';

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
