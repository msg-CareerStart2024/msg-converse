import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS, BASE_URL } from '../../config/api-config';
import { API_CACHE_TAGS } from '../../config/api-tags';
import { setCredentials } from '../../features/login/slices/auth-slice';
import { AuthState } from '../../types/login/AuthState.types';
import { User } from '../../types/login/User.types';
import { UserRole } from '../../types/login/UserRole.enum';
import { LoginFormValues } from '../../types/users/LoginFormValues.types';
import { SignupFormValues } from '../../types/users/SignUpFormValues.types';

export const authApi = createApi({
    reducerPath: 'authApi',
    tagTypes: [API_CACHE_TAGS.AUTH, API_CACHE_TAGS.USERS],
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
            invalidatesTags: [API_CACHE_TAGS.AUTH],
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
            invalidatesTags: [API_CACHE_TAGS.USERS]
        })
    })
});

export const { useLoginUserMutation, useRegisterUserMutation } = authApi;
