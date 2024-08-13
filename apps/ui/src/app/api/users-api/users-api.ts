import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URLS, BASE_URL } from '../../config/api-config';
import { API_CACHE_TAGS } from '../../config/api-tags';
import { addBearerAuthHeader } from '../../utils/utils';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    tagTypes: [API_CACHE_TAGS.USERS],
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL + API_URLS.USERS,
        prepareHeaders: addBearerAuthHeader
    }),
    endpoints: builder => ({
        getUserById: builder.query({
            query: id => `${id}`,
            providesTags: [API_CACHE_TAGS.USERS]
        })
    })
});

export const { useLazyGetUserByIdQuery } = usersApi;
