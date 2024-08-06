import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { UserFormValues, userSchema } from '../../../types/users/login.types';
import SignInForm from '../components/SignInForm';

export default function SignInContainer() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema)
    });

    const onSubmit: SubmitHandler<UserFormValues> = data => {
        alert(`Login not yet implemented, ${data.email}, ${data.password}`);
    };

    return (
        <SignInForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
        />
    );
}
