import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../../api/auth-api/auth-api';
import { SignupFormValues, signUpSchema } from '../../../types/users/SignUpFormValues.types';
import SignUpFormView from '../components/SignUpFormView';

export default function SignUpPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signUpSchema)
    });

    const navigate = useNavigate();
    const [registerUser, { error, isLoading }] = useRegisterUserMutation();
    const handleRegister: SubmitHandler<SignupFormValues> = async data => {
        try {
            await registerUser(data).unwrap();
            navigate('/login');
        } catch (error) {
            console.error('Register failed', error);
        }
    };

    return (
        <SignUpFormView
            register={register}
            handleSubmit={handleSubmit(handleRegister)}
            errors={errors}
            registerError={error}
            isLoading={isLoading}
        />
    );
}
