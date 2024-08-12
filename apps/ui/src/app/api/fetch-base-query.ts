import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { BASE_URL } from '../config/api-config';
import { RootState } from '../store/store';

export default function getFetchBaseQuery() {
    return fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;
            const token = state.auth.accessToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    });
}
