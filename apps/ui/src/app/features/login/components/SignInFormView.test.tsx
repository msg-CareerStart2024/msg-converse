import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UseFormRegister } from 'react-hook-form';
import { beforeEach, describe, vi } from 'vitest';
import { LoginFormValues } from '../../../types/users/LoginFormValues.types';
import SignInFormView from './SignInFormView';

const mockRegister: UseFormRegister<LoginFormValues> = vi.fn();

describe('SignInFormView', () => {
    const handleSubmit = vi.fn();
    const errors = {};
    const loginError = undefined;
    const isLoading = false;

    beforeEach(() => {
        render(
            <SignInFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={errors}
                loginError={loginError}
                isLoading={isLoading}
            />
        );
    });

    it('renders the sign-in form correctly', () => {
        expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows error message when email is invalid', async () => {
        render(
            <SignInFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={{ email: { type: 'email', message: 'You have to provide a valid email!' } }}
                loginError={loginError}
                isLoading={isLoading}
            />
        );

        expect(screen.getByText('You have to provide a valid email!')).toBeInTheDocument();
    });

    it('calls handleSubmit when the form is submitted', async () => {
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledTimes(1);
        });
    });

    it('displays a loading indicator when submitting', () => {
        render(
            <SignInFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={errors}
                loginError={loginError}
                isLoading={true}
            />
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows an error message if login fails', () => {
        render(
            <SignInFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={errors}
                loginError={{ message: 'Invalid email or password' }}
                isLoading={false}
            />
        );

        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
});
