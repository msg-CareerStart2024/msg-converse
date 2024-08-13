import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../../store/store';
import { useLazyGetUserByIdQuery } from './users-api';

describe('usersApi', () => {
    it('should get user by id', async () => {
        const store = setupStore();
        const { result } = renderHook(() => useLazyGetUserByIdQuery(), {
            wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
        });

        act(() => {
            result.current[0]('1');
        });

        await waitFor(() => expect(result.current[1].isSuccess).toBe(true));
        expect(result.current[1].data?.id).toBe('1');
        expect(result.current[1].data?.email).toBe('test@msg.group');
    });
});
