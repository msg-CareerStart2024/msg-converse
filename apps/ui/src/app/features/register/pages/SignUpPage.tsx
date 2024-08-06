import { SignupFormValues, signUpSchema } from '../../../types/users/signup.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import SignUpFormView from '../components/SignUpFormView';

export default function SignUpPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signUpSchema)
    });

    const onSubmit: SubmitHandler<SignupFormValues> = data => {
        alert('Sign up not yet implemented');
    };

    return (
        <SignUpFormView
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
        />
    );
}
