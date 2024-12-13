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
        getMyOrders: builder.query({
            query: () => `${ORDERS_URL}/myorders`,
        }),
        getOrders: builder.query({
            query: () => `${ORDERS_URL}`,
            keepUnusedDataFor: 5,
        }),
        updateOrderToDelivered: builder.mutation({
            query: (id) => ({
                url: `${ORDERS_URL}/${id}/deliver`,
                method: 'PUT',
            }),
        }),
    }),
});

export const { useCreateOrderMutation, useGetOrderByIdQuery, usePayOrderMutation, useGetPaypalClientIdQuery, useGetMyOrdersQuery, useGetOrdersQuery, useUpdateOrderToDeliveredMutation } = orderApiSlice;