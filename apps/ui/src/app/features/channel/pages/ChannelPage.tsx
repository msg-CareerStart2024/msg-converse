import { useForm } from 'react-hook-form';
import ChannelFormView from '../components/ChannelFormView';
import { ChannelFormValues, channelSchema } from '../../../types/channel/channel.types';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ChannelPage() {
    const isEdit = false;

    let channelData = {
        channelName: '',
        description: '',
        topics: []
    };

    if (isEdit) {
        channelData = {
            channelName: 'Example Channel',
            description: 'Example Description',
            topics: []
        };
    }

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
            onSubmit={function (): void {
                throw new Error('Function not implemented.');
            }}
        />
    );
}
