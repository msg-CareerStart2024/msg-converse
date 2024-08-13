import { API_CACHE_TAGS } from '../config/api-tags';
import { API_URLS } from '../config/api-config';
import { createApi } from '@reduxjs/toolkit/query/react';
import getFetchBaseQuery from './fetch-base-query';

export const usersApi = createApi({
    reducerPath: 'usersApi',
    tagTypes: [API_CACHE_TAGS.USERS],
    baseQuery: getFetchBaseQuery(API_URLS.USERS),
    endpoints: builder => ({
        getUserById: builder.query({
            query: id => `${id}`,
            providesTags: [API_CACHE_TAGS.USERS]
        })
    })
});

export const { useLazyGetUserByIdQuery } = usersApi;
