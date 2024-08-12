import { createApi } from '@reduxjs/toolkit/query/react';
import { API_CACHE_TAGS } from '../config/api-tags';
import getFetchBaseQuery from './fetch-base-query';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    tagTypes: [API_CACHE_TAGS.USERS],
    baseQuery: getFetchBaseQuery(),
    endpoints: builder => ({
        getUserById: builder.query({
            query: id => `${id}`,
            providesTags: [API_CACHE_TAGS.USERS]
        })
    })
});

export const { useLazyGetUserByIdQuery } = usersApi;
