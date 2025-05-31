import { CREATEORDER,GETMYORDERS,GETSINGLEORDER } from "../Constant/constant";
import { apiSlice } from "./apiSlice";

const orderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: CREATEORDER,
        method: "POST",
        body: data,
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: GETMYORDERS,
        method: "GET",
      }),
    }),
    getSingleOrder: builder.query({
      query: (id) => ({
        url: `${GETSINGLEORDER}/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateOrderMutation, useGetMyOrdersQuery, useGetSingleOrderQuery } = orderSlice;
