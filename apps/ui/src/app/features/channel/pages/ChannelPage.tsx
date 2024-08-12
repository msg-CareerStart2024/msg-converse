import { useForm } from 'react-hook-form';
import ChannelFormView from '../components/ChannelFormView';
import { ChannelFormValues, channelSchema } from '../../../types/channel/channel.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';

type ChannelPageProps = {
    isEdit: boolean;
};

export default function ChannelPage({ isEdit }: ChannelPageProps) {
    const { id } = useParams<{ id?: string }>();

    let channelData = {
        channelName: '',
        description: '',
        topics: []
    };

    if (isEdit && id) {
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
            isEditForm={isEdit}
            initialValues={channelData}
            onSubmit={function (): void {
                throw new Error('Function not implemented.');
            }}
        />
    );
}
