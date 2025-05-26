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
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword/:token" element={<ResetPassword />} />

          <Route path="/ProtectedRoutes" element={<ProtectRoute />}>
            <Route path="/ProtectedRoutes/Profile" element={<Profile />} />
            <Route
              path="/ProtectedRoutes/EditProfile"
              element={<EditProfile />}
            />
            <Route
              path="/ProtectedRoutes/UpdatePassword"
              element={<UpdatePassword />}
            />
            <Route path="/ProtectedRoutes/Shipping" element={<Shipping />} />
            <Route path="/ProtectedRoutes/order/success" element={<OrderSuccess />} />
            <Route
              path="/ProtectedRoutes/ConfirmOrder"
              element={<ConfirmOrder />}
            />

            {/* Load stripe only if the key is available */}
            <Route
              path="/ProtectedRoutes/Payment"
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
          <Route path="/" element={<Home />} />
          <Route path="/search/:keyword" element={<ProductSearch />} />
          <Route path="/ProductDetails/:id" element={<ProductDetails />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
