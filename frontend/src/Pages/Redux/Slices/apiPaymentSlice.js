import { PROCESSPAYMENT, GETSTRIPEAPIKEY } from "../Constant/constant";
import { apiSlice } from "./apiSlice";

const paymentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    processPayment: builder.mutation({
      query: (data) => ({
        url: PROCESSPAYMENT,
        method: "POST",
        body: data,
      }),
    }),
    getStripeApiKey: builder.query({
      query: () => ({
        url: GETSTRIPEAPIKEY,
        method: "GET",
      }),
    }),
  }),
});

export const { useProcessPaymentMutation, useGetStripeApiKeyQuery } =
  paymentSlice;
