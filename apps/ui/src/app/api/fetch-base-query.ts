import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { BASE_URL } from '../config/api-config';
import { addBearerAuthHeader } from '../utils/utils';

export default function getFetchBaseQuery(urlPrefix = '') {
    const baseUrl = urlPrefix ? `${BASE_URL}${urlPrefix}`.replace(/\/+$/, '') : BASE_URL;

    return fetchBaseQuery({
        baseUrl,
        prepareHeaders: addBearerAuthHeader
    });
}
