import { apiSlice } from './apiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: order,
            }),
        }),
        getOrderById: builder.query({
            query: (id) => `${ORDERS_URL}/${id}`,
            keepUnusedDataFor: 5,
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: details,
            }),
        }),
        getPaypalClientId: builder.query({
            query: () => `${PAYPAL_URL}`,
            keepUnusedDataFor: 5,
        }),
    }),
});

export const { useCreateOrderMutation, useGetOrderByIdQuery, usePayOrderMutation, useGetPaypalClientIdQuery } = orderApiSlice;