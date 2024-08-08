import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import { z } from 'zod';

export const channelNameCheck = z.string().min(1, 'Channel name is required');
export const topicsCheck = z.array(z.string()).min(1, 'At least one topic is required');

export const channelSchema = z.object({
    channelName: channelNameCheck,
    topics: topicsCheck
});

export type ChannelFormValues = z.infer<typeof channelSchema>;

export type FormValues = {
    channelName: string;
    description?: string;
    topics: string[];
};

export type ChannelFormProps = {
    handleSubmit: UseFormHandleSubmit<FormValues>;
    register: UseFormRegister<FormValues>;
    errors: FieldErrors<FormValues>;
    isSubmitting: boolean;
    isEditForm: boolean;
    initialValues?: FormValues;
};
