import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { UserFormValues, userSchema } from '../../../types/users/login.types';
import SignInFormView from '../components/SignInFormView';

export default function SignInPage() {
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
        <SignInFormView
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
        />
    );
}
