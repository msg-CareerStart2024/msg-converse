import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS, BASE_URL } from '../config/api-config';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    tagTypes: ['Users'],
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL + API_URLS.USERS,
        prepareHeaders: headers => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),

    endpoints: builder => ({
        getUserById: builder.query({
            query: id => `${id}`,
            providesTags: ['Users']
        })
    })
});

export const { useLazyGetUserByIdQuery } = usersApi;
