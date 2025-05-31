const BASE_URL = "http://localhost:8000/api";
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
const CREATEREVIEW = '/products/review';

// admin
const GET_PRODUCTS_ADMIN = '/products/admin/products';
const CREATE_PRODUCT = '/products/admin/create';
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
  CREATE_PRODUCT
};
