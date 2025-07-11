const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GET_PRODUCTS = "/products/get";
const REGISTER = "/auth/register";
const LOGIN = "/auth/login";
const LOGOUT = "/auth/logout";
const PROFILE = "/auth/profile";
const UPDATE_PASSWORD = "/auth/changePassword";
const FORGOTPASSWORD = "/auth/forgot";
const RESETPASSWORD = "/auth/reset";
const PROCESSPAYMENT = "/payment/process";
const GETSTRIPEAPIKEY = "/payment/stripeapikey";
const CREATEORDER = "/orders/create";
const GETMYORDERS = "/orders/myOrders";
const GETSINGLEORDER = "/orders/get";
const CREATEREVIEW = "/products/review";

// admin
const GET_PRODUCTS_ADMIN = "/products/admin/products";
const CREATE_PRODUCT = "/products/admin/create";
const DELETE_PRODUCT = "/products/admin/delete";
const UPDATE_PRODUCT = "/products/admin/update";
const GET_ALL_ORDERS_ADMIN = "/orders/admin/allOrders";
const UPDATE_AND_DELETE_ORDERS_ADMIN = "/orders/admin";
const GETALLUSERS_UPDATE_DELETE_GETSINGLE_USER = "/auth/admin/profile";
const GET_AND_DELETE_SINGLE_PRODUCT_REVIEWS = "/products/admin/Reviews";
const MARK_AS_PAID = "/orders/admin/orderIsPaid";

export {
  BASE_URL,
  GET_PRODUCTS,
  REGISTER,
  LOGIN,
  LOGOUT,
  PROFILE,
  UPDATE_PASSWORD,
  FORGOTPASSWORD,
  RESETPASSWORD,
  PROCESSPAYMENT,
  GETSTRIPEAPIKEY,
  CREATEORDER,
  GETMYORDERS,
  GETSINGLEORDER,
  CREATEREVIEW,
  GET_PRODUCTS_ADMIN,
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  GET_ALL_ORDERS_ADMIN,
  UPDATE_AND_DELETE_ORDERS_ADMIN,
  GETALLUSERS_UPDATE_DELETE_GETSINGLE_USER,
  GET_AND_DELETE_SINGLE_PRODUCT_REVIEWS,
  MARK_AS_PAID,
};
