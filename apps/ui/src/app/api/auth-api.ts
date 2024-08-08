import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS, BASE_URL } from '../config/api-config';
import { setCredentials } from '../features/login/slices/auth-slice';
import { AuthState } from '../types/login/AuthState';
import { User } from '../types/login/User';
import { UserRole } from '../types/login/UserRole';
import { LoginFormValues } from '../types/users/login.types';
import { SignupFormValues } from '../types/users/signup.types';

export const authApi = createApi({
    reducerPath: 'authApi',
    tagTypes: ['Auth', 'Users'],
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL + API_URLS.AUTH
    }),
    endpoints: builder => ({
        loginUser: builder.mutation<AuthState, LoginFormValues>({
            query: credentials => ({
                url: 'login',
                method: 'POST',
                body: credentials
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch (error) {
                    console.error('Invalid credentials.');
                }
            }
        }),
        registerUser: builder.mutation<User, SignupFormValues>({
            query: data => ({
                url: 'register',
                method: 'POST',
                body: { ...data, role: UserRole.USER }
            }),
            invalidatesTags: ['Users']
        })
    })
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;
