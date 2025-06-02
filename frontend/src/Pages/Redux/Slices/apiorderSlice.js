import {
  CREATEORDER,
  GETMYORDERS,
  GETSINGLEORDER,
  GET_ALL_ORDERS_ADMIN,
  UPDATE_AND_DELETE_ORDERS_ADMIN,
} from "../Constant/constant";
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

    // Admin
    getAllOrdersAdmin: builder.query({
      query: () => ({
        url: GET_ALL_ORDERS_ADMIN,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    updateOrdersAdmin: builder.mutation({
      query: ({ productId, data }) => ({
        url: `${UPDATE_AND_DELETE_ORDERS_ADMIN}/${productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrdersAdmin: builder.mutation({
      query: (id) => ({
        url: `${UPDATE_AND_DELETE_ORDERS_ADMIN}/${id}`,
        method: "DELETE",
      }),
invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetSingleOrderQuery,
  useGetAllOrdersAdminQuery,
  useUpdateOrdersAdminMutation,
  useDeleteOrdersAdminMutation,
} = orderSlice;
