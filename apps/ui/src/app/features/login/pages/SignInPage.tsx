import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../../../api/auth-api/auth-api';
import { LoginFormValues, userSchema } from '../../../types/users/LoginFormValues.types';
import SignInFormView from '../components/SignInFormView';
import { store } from '../../../store/store';
import { channelsApi } from '../../../api/channels-api';
import { API_CACHE_TAGS } from '../../../config/api-tags';

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
            store.dispatch(channelsApi.util.invalidateTags([API_CACHE_TAGS.JOINED_CHANNELS]));
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
