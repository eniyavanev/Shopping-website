import { GET_PRODUCTS } from "../Constant/constant";
import { apiSlice } from "./apiSlice";

const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //Public
    getProducts: builder.query({
      query: ({ keyword, price, category,rating, page }) => {
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

        //console.log("Final link:", link);

        return {
          url: link,
          method: "GET",
        };
      },
    }),
    //public
    getSingleProduct: builder.query({
      query: (id) => ({
        url: `${GET_PRODUCTS}/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetSingleProductQuery } = productSlice;
