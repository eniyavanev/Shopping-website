// productSlice.js
import {
  GET_PRODUCTS,
  CREATEREVIEW,
  GET_PRODUCTS_ADMIN,
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  GET_AND_DELETE_SINGLE_PRODUCT_REVIEWS,
} from "../Constant/constant";
import { apiSlice } from "./apiSlice";

const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getProducts: builder.query({
      query: ({ keyword, price, category, rating, page }) => {
        let link = `${GET_PRODUCTS}?page=${page}`;

        if (keyword) {
          link += `&keyword=${keyword}`;
        }

        if (price && Array.isArray(price)) {
          link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
        }

        if (category) {
          link += `&category=${category}`;
        }

        if (rating) {
          link += `&ratings=${rating}`;
        }

        return {
          url: link,
          method: "GET",
        };
      },
    }),

    // Public
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `${GET_PRODUCTS}/${id}`,
        method: "GET",
      }),
    }),

    // Private
    createReview: builder.mutation({
      query: (data) => ({
        url: CREATEREVIEW,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Review"], // 👈 Trigger refetch after mutation
    }),

    getSingleProductReviews: builder.query({
      query: (id) => ({
        url: `${CREATEREVIEW}?id=${id}`,
        method: "GET",
      }),
      providesTags: ["Review"], // 👈 Tag this query for cache control
    }),

    // Admin
    getProductsAdmin: builder.query({
      query: () => ({
        url: GET_PRODUCTS_ADMIN,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: CREATE_PRODUCT,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${UPDATE_PRODUCT}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteSingleProduct: builder.mutation({
      query: (id) => ({
        url: `${DELETE_PRODUCT}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getSingleProductReviewsAdmin: builder.query({
      query: (id) => ({
        url: `${GET_AND_DELETE_SINGLE_PRODUCT_REVIEWS}?id=${id}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
    deleteReview: builder.mutation({
      query: ( {productId, reviewId}) => ({
        url: `${GET_AND_DELETE_SINGLE_PRODUCT_REVIEWS}?id=${reviewId}&productId=${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSingleProductQuery,
  useCreateReviewMutation,
  useGetSingleProductReviewsQuery,
  useGetProductsAdminQuery,
  useCreateProductMutation,
  useDeleteSingleProductMutation,
  useUpdateProductMutation,
  useDeleteReviewMutation,
  useGetSingleProductReviewsAdminQuery,
} = productSlice;
