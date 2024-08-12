import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { clearCredentials } from '../../features/login/slices/auth-slice';
import { store } from '../../store/store';
import { SignupFormValues, signUpSchema } from '../../types/users/signup.types';
import { useLoginUserMutation, useRegisterUserMutation } from './auth-api';

describe('authApi', () => {
    it('should login successfully and set credentials', async () => {
        const { result } = renderHook(() => useLoginUserMutation(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
        });

        act(() => {
            result.current[0]({ email: 'test@msg.group', password: 'testPass' });
        });
        await waitFor(() => expect(result.current[1].isSuccess).toBe(true));

        expect(store.getState().auth.user?.email).toBe('test@msg.group');
    });

    it('should handle login failure', async () => {
        const { result } = renderHook(() => useLoginUserMutation(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
        });

        store.dispatch(clearCredentials());
        expect(store.getState().auth.user?.email).toBeUndefined();

        act(() => {
            result.current[0]({ email: 'wrong@example.com', password: 'wrongpassword' });
        });
        await waitFor(() => expect(result.current[1].isError).toBe(true));

        expect(store.getState().auth.user?.email).toBeUndefined();
    });

    it('should register a new user', async () => {
        const { result } = renderHook(() => useRegisterUserMutation(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
        });

        const validData: SignupFormValues = {
            email: 'test@msg.group',
            firstName: 'Test',
            lastName: 'Hard',
            password: 'testpass2!A@'
        };
        act(() => {
            result.current[0](validData);
        });
        const validationResult = signUpSchema.safeParse(validData);

        expect(validationResult.success).toBe(true);

        await waitFor(() => expect(result.current[1].isSuccess).toBe(true));
    });

    it('should handle registration failure', async () => {
        const { result } = renderHook(() => useRegisterUserMutation(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
        });

        const invalidData: SignupFormValues = {
            email: 'test@msg.group',
            firstName: 'Test',
            lastName: 'Hard',
            password: 'testpass'
        };
        act(() => {
            result.current[0](invalidData);
        });
        const validationResult = signUpSchema.safeParse(invalidData);

        expect(validationResult.success).toBe(false);

        await waitFor(() => expect(result.current[1].isError).toBe(true));
    });
});
