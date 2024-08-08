import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS, BASE_URL } from '../config/api-config';
import { API_CACHE_TAGS } from '../config/api-tags';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    tagTypes: [API_CACHE_TAGS.USERS],
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
            providesTags: [API_CACHE_TAGS.USERS]
        })
    })
});

export const { useLazyGetUserByIdQuery } = usersApi;
