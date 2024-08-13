import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { BASE_URL } from '../config/api-config';

export default function getFetchBaseQuery() {
    return fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: headers => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    });
}
