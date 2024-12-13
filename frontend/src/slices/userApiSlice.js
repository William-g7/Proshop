import { USERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
                credentials: 'include',
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/register`,
                method: 'POST',
                body: data,
            }),
        }),
        updateUserProfile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),

    }),
});


export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserProfileMutation } = userApiSlice;