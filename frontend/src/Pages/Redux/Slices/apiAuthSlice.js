
import { REGISTER, LOGIN, LOGOUT, PROFILE,UPDATE_PASSWORD, FORGOTPASSWORD, RESETPASSWORD } from "../Constant/constant";
import { apiSlice } from "./apiSlice";

const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: REGISTER,
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: LOGIN,
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: LOGOUT,
        method: "POST",
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: PROFILE,
        method: "PUT",
        body: data,
      }),
    }),
    getUserProfile: builder.query({
      query: (id) => ({
        url: `${PROFILE}`,
        method: "GET",
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: UPDATE_PASSWORD,
        method: "PUT",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: FORGOTPASSWORD,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: `/auth/reset/${token}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useUpdateUserProfileMutation,
  useGetUserProfileQuery,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authSlice;
