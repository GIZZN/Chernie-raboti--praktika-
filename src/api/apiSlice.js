import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    credentials: 'include'
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => 'products'
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`
    }),
    addProduct: builder.mutation({
      query: (product) => ({
        url: 'products',
        method: 'POST',
        body: product
      })
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation
} = api; 