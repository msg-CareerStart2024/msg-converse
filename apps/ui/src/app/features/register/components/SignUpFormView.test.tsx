import { fireEvent, render, screen } from '@testing-library/react';
import { UseFormRegister } from 'react-hook-form';
import { vi } from 'vitest';
import { SignupFormValues } from '../../../types/users/signup.types';
import SignUpFormView from './SignUpFormView';

const mockRegister: UseFormRegister<SignupFormValues> = vi.fn();

describe('SignUpFormView', () => {
    const handleSubmit = vi.fn();
    const errors = {};
    const registerError = undefined;
    const isLoading = false;

    beforeEach(() => {
        render(
            <SignUpFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={errors}
                registerError={registerError}
                isLoading={isLoading}
            />
        );
    });

    it('renders the sign-up form correctly', () => {
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('shows error message when email is invalid', () => {
        render(
            <SignUpFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={{ email: { type: 'email', message: 'You have to provide a valid email' } }}
                registerError={registerError}
                isLoading={isLoading}
            />
        );

        expect(screen.getByText('You have to provide a valid email')).toBeInTheDocument();
    });

    it('calls handleSubmit when the form is submitted', () => {
        const firstNameInput = screen.getByLabelText(/first name/i);
        const lastNameInput = screen.getByLabelText(/last name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(firstNameInput, { target: { value: 'John' } });
        fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        fireEvent.click(submitButton);

        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('displays a loading indicator when submitting', () => {
        render(
            <SignUpFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={errors}
                registerError={registerError}
                isLoading={true}
            />
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows an error message if registration fails', () => {
        render(
            <SignUpFormView
                handleSubmit={handleSubmit}
                register={mockRegister}
                errors={errors}
                registerError={{ message: 'An error occurred, please try again.' }}
                isLoading={false}
            />
        );

        expect(screen.getByText(/an error occured, please try again/i)).toBeInTheDocument();
    });
});
