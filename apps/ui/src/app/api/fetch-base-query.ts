import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { BASE_URL } from '../config/api-config';
import { addBearerAuthHeader } from '../utils/utils';

export default function getFetchBaseQuery() {
    return fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: addBearerAuthHeader
    });
}
