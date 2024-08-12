import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../../../api/auth-api';
import { LoginFormValues, userSchema } from '../../../types/users/login.types';
import SignInFormView from '../components/SignInFormView';

export default function SignInPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(userSchema)
    });
    const [loginUser, { error, isLoading }] = useLoginUserMutation();
    const navigate = useNavigate();

    const handleLogin: SubmitHandler<LoginFormValues> = async data => {
        try {
            await loginUser(data).unwrap();
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    return (
        <SignInFormView
            register={register}
            handleSubmit={handleSubmit(handleLogin)}
            errors={errors}
            loginError={error}
            isLoading={isLoading}
        />
    );
}
