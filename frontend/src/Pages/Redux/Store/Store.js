import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../Slices/apiSlice";
import protectRouteReducer from "../Slices/protectRouteSlice";
import cartReducer from "../Slices/cartSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    protectRoute: protectRouteReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
