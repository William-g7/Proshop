import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
});

const baseQueryWithReauth = async (args, api, extra) => {
    const result = await baseQuery(args, api, extra);
    if (result.error && result.error.status === 401) {
        api.dispatch(logout());
    }
    return result;
};


export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Product', 'Order', 'User'],
    endpoints: (builder) => ({}),
});

export default apiSlice;