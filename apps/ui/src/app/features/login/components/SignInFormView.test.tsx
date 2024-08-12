import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { UseFormRegister } from 'react-hook-form';
import { beforeEach, describe, test, vi } from 'vitest';
import { LoginFormValues } from '../../../types/users/login.types';
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

    test('renders the sign-in form correctly', () => {
        // Check if the form fields are rendered
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

        // Check if the sign-in button is rendered
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('shows error message when email is invalid', async () => {
        // Re-render the component with an error state for email
        render(
            <SignInFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={{ email: { message: 'Invalid email' } }}
                loginError={loginError}
                isLoading={isLoading}
            />
        );

        expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    test('calls handleSubmit when the form is submitted', async () => {
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        // Simulate user input
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Simulate form submission
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledTimes(1);
        });
    });

    test('displays a loading indicator when submitting', () => {
        render(
            <SignInFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={errors}
                loginError={loginError}
                isLoading={true} // Set loading state to true
            />
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('shows an error message if login fails', () => {
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
