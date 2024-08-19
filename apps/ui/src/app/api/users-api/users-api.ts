import { createApi } from '@reduxjs/toolkit/query/react';
<<<<<<< HEAD:apps/ui/src/app/api/users-api.ts
import { API_CACHE_TAGS } from '../config/api-tags';
import getFetchBaseQuery from './fetch-base-query';
import { API_URLS } from '../config/api-config';
=======
import { API_URLS } from '../../config/api-config';
import { API_CACHE_TAGS } from '../../config/api-tags';
import getFetchBaseQuery from '../fetch-base-query';
>>>>>>> main:apps/ui/src/app/api/users-api/users-api.ts

export const usersApi = createApi({
    reducerPath: 'usersApi',
    tagTypes: [API_CACHE_TAGS.USERS],
    baseQuery: getFetchBaseQuery(API_URLS.USERS),
    endpoints: builder => ({
        getUserById: builder.query({
            query: id => `${API_URLS.USERS}/${id}`,
            providesTags: [API_CACHE_TAGS.USERS]
        })
    })
});

export const { useLazyGetUserByIdQuery } = usersApi;
