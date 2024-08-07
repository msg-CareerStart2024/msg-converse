import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ChannelFormView from '../components/ChannelFormView';
import { ChannelFormValues, channelSchema } from '../../../types/channels/channel.types';

export default function ChannelPage() {
    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<ChannelFormValues>({
        resolver: zodResolver(channelSchema)
    });

    // const onSubmit: SubmitHandler<ChannelFormValues> = data => {
    //     alert(`Create not yet implemented, ${data.channelName}, ${data.description}`);
    // };

    return (
        <ChannelFormView
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            isSubmitting={false}
        />
    );
}
