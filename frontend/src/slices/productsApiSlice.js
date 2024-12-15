import { PRODUCTS_URL, UPLOAD_URL } from '../constants';
import { apiSlice } from './apiSlice';

const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: `${PRODUCTS_URL}`,
            }),
            providesTags: ['Products'],
            keepUnusedDataFor: 5,
        }),

        getProductDetails: builder.query({
            query: (id) => ({
                url: `${PRODUCTS_URL}/${id}`,
            }),
            providesTags: ['Product'],
            keepUnusedDataFor: 5,
        }),

        createProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCTS_URL}`,
                method: 'POST',
                body: product,
            }),
            invalidatesTags: ['Products'],
        }),

        updateProduct: builder.mutation({
            query: (product) => ({
                url: `${PRODUCTS_URL}/${product._id}`,
                method: 'PUT',
                body: product,
            }),
            invalidatesTags: ['Products'],
        }),

        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `/api/upload`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useGetProductsQuery, useGetProductDetailsQuery, useCreateProductMutation, useUpdateProductMutation, useUploadProductImageMutation } = productsApiSlice;