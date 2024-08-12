import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../../types/login/AuthState';

const initialState: AuthState = {
    user: undefined,
    accessToken: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthState>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            localStorage.setItem('accessToken', action.payload.accessToken as string);
        },
        clearCredentials: state => {
            state.user = undefined;
            state.accessToken = undefined;
            localStorage.removeItem('accessToken');
        }
    }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
