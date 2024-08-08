import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

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

export enum ACTION_TYPE {
    create,
    update,
    delete
}
