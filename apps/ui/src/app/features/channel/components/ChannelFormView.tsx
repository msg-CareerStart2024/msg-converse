import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

type FormValues = {
    channelName: string;
    description: string;
    topics: string[];
};

type ChannelFormProps = {
    handleSubmit: UseFormHandleSubmit<FormValues>;
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    isSubmitting: boolean;
};

export default function ChannelFormView({
    handleSubmit,
    register,
    errors,
    isSubmitting
}: ChannelFormProps) {
    return <div>Channel</div>;
}
