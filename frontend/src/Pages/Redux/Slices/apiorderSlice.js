
import {
  CREATEORDER,
  GETMYORDERS,
  GETSINGLEORDER,
  GET_ALL_ORDERS_ADMIN,
  UPDATE_AND_DELETE_ORDERS_ADMIN,
  MARK_AS_PAID
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
      invalidatesTags: ["Order"],
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: GETMYORDERS,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),
    getSingleOrder: builder.query({
      query: (id) => ({
        url: `${GETSINGLEORDER}/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
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
      query: ({ id, orderStatus }) => ({
        url: `${UPDATE_AND_DELETE_ORDERS_ADMIN}/${id}`,
        method: "PUT",
        body: {orderStatus},
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
    markOrderAsPaid: builder.mutation({
      query: (id) => ({
        url: `${MARK_AS_PAID}/${id}`,
        method: "PUT",
      }),
    })
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetSingleOrderQuery,
  useGetAllOrdersAdminQuery,
  useUpdateOrdersAdminMutation,
  useDeleteOrdersAdminMutation,
  useMarkOrderAsPaidMutation
} = orderSlice;
