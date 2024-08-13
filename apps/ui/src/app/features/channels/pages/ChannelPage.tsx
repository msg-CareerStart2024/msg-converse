import { useForm } from 'react-hook-form';
import ChannelFormView from '../components/ChannelFormView';
import { useParams } from 'react-router-dom';
import { useLazyGetChannelByIdQuery } from '../../../api/channels-api';
import { Typography } from '@mui/material';
import { useEffect } from 'react';
import { ChannelFormValues } from '../schemas/ChannelFormValues.schema';

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

    const {
        handleSubmit,
        register,
        setValue,
        getValues,
        formState: { errors }
    } = useForm<ChannelFormValues>();

    useEffect(() => {
        if (data) {
            console.log('data has arrived');
            setValue('name', data.name);
            setValue('description', data.description);
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
            getValues={getValues}
            setValue={setValue}
        />
    );
}
