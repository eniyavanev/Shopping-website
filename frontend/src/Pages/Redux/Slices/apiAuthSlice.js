import {
  REGISTER,
  LOGIN,
  LOGOUT,
  PROFILE,
  UPDATE_PASSWORD,
  FORGOTPASSWORD,
  RESETPASSWORD,
  GETALLUSERS_UPDATE_DELETE_GETSINGLE_USER,
} from "../Constant/constant";
import { apiSlice } from "./apiSlice";

const authSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: REGISTER,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: LOGIN,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: LOGOUT,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: PROFILE,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getUserProfile: builder.query({
      query: (id) => ({
        url: `${PROFILE}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: UPDATE_PASSWORD,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: FORGOTPASSWORD,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: `/auth/reset/${token}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: GETALLUSERS_UPDATE_DELETE_GETSINGLE_USER,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({userId, form}) => ({
        url: `${GETALLUSERS_UPDATE_DELETE_GETSINGLE_USER}/${userId}`,
        method: "PUT",
        body: form,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${GETALLUSERS_UPDATE_DELETE_GETSINGLE_USER}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getSingleUser: builder.query({
      query: (id) => ({
        url: `${GETALLUSERS_UPDATE_DELETE_GETSINGLE_USER}/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
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
  useResetPasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
} = authSlice;
