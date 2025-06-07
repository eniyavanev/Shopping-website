import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./Components/Main/Main";
import Home from "../src/Pages/Home";
import ProtectRoute from "./Components/ProtectRoute/ProtectRoute";
import Login from "./Components/Authentication/Login";
import Signup from "./Components/Authentication/Signup";
import Cart from "./Pages/Cart";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import ProductDetails from "./Pages/ProductDetails";
import ProductSearch from "./Pages/ProductSearch";
import Profile from "./Pages/Profile/Profile";
import EditProfile from "./Pages/Profile/EditProfile";
import UpdatePassword from "./Pages/Profile/UpdatePassword";
import ForgotPassword from "./Components/Authentication/ForgotPassword";
import ResetPassword from "./Components/Authentication/ResetPassword";
import Shipping from "./Pages/Shipping";
import ConfirmOrder from "./Pages/ConfirmOrder";
import Payment from "./Pages/Payment";
import { useGetStripeApiKeyQuery } from "./Pages/Redux/Slices/apiPaymentSlice";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./Pages/OrderSuccess";
import Wishlist from "./Pages/WishList";
import UserOrders from "./Pages/UserOrders/UserOrders";
import OrderDetail from "./Pages/UserOrders/OrderDetail";
import Dashboard from "./Pages/Admin Pages/NewProduct";
import AdminProductList from "./Pages/Admin Pages/AdminProductList";
import AdminLayout from "./Components/Admin/AdminLayout";
import MainContent from "./Pages/Admin Pages/MainContent";
import NewProduct from "./Pages/Admin Pages/NewProduct";
import UpdateProduct from "./Pages/Admin Pages/UpdateProduct";
import OrdersList from "./Pages/Admin Pages/OrdersList";
import ErrorPage from "./Components/ui/ErrorPage";
import UpdateOrder from "./Pages/Admin Pages/UpdateOrder";
import AllUsers from "./Pages/Admin Pages/AllUsers";
import UpdateUser from "./Pages/Admin Pages/UpdateUser";
import Reviews from "./Pages/Admin Pages/Reviews";

function App() {
  const { data, isSuccess } = useGetStripeApiKeyQuery();
  const [stripeApiKey, setStripeApiKey] = useState("");
  // console.log("stripeApiKey", stripeApiKey);

  // Set the key only once when fetched
  useEffect(() => {
    if (isSuccess && data?.stripeApiKey) {
      setStripeApiKey(data.stripeApiKey);
    }
  }, [data, isSuccess]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/" element={<Main />}>
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/ResetPassword/:token" element={<ResetPassword />} />

            <Route path="/ProtectedRoutes" element={<ProtectRoute />}>
              <Route path="Profile" element={<Profile />} />
              <Route path="EditProfile" element={<EditProfile />} />
              <Route path="UpdatePassword" element={<UpdatePassword />} />
              <Route path="Shipping" element={<Shipping />} />
              <Route path="UserOrders" element={<UserOrders />} />
              <Route path="OrderDetail/:id" element={<OrderDetail />} />
              <Route path="order/success" element={<OrderSuccess />} />
              <Route path="ConfirmOrder" element={<ConfirmOrder />} />

              {/* Load stripe only if the key is available */}
              <Route
                path="Payment"
                element={
                  stripeApiKey ? (
                    <Elements stripe={loadStripe(stripeApiKey)}>
                      <Payment />
                    </Elements>
                  ) : (
                    <p>Loading payment gateway...</p>
                  )
                }
              />
            </Route>

            <Route path="/Cart" element={<Cart />} />
            <Route path="/Wishlist" element={<Wishlist />} />
            <Route path="/" element={<Home />} />
            <Route path="/search/:keyword" element={<ProductSearch />} />
            <Route path="/ProductDetails/:id" element={<ProductDetails />} />
          </Route>

          {/* Admin protected routes */}
          <Route
            path="/ProtectedRoutes/Admin"
            element={<ProtectRoute requiredRole="admin" />}
          >
            {" "}
            <Route element={<AdminLayout />}>
              <Route path="Dashboard" element={<MainContent />} />
              <Route path="createProduct" element={<NewProduct />} />
              <Route path="UpdateProduct/:id" element={<UpdateProduct />} />
              <Route path="UpdateOrder/:id" element={<UpdateOrder />} />
              <Route path="OrdersList" element={<OrdersList />} />
              <Route path="AdminProductList" element={<AdminProductList />} />
              <Route path="AllUsers" element={<AllUsers />} />
              <Route path="UpdateUser/:id" element={<UpdateUser />} />
              <Route path="Reviews" element={<Reviews />} />
            </Route>
            {/* other admin routes */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
