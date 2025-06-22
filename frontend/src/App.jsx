import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useGetStripeApiKeyQuery } from "./Pages/Redux/Slices/apiPaymentSlice";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import WhatsAppButton from "./Components/ui/WhatsAppButton";

// Lazy Load Components
const Main = lazy(() => import("./Components/Main/Main"));
const Home = lazy(() => import("./Pages/Home"));
const ProtectRoute = lazy(() =>
  import("./Components/ProtectRoute/ProtectRoute")
);
const Login = lazy(() => import("./Components/Authentication/Login"));
const Signup = lazy(() => import("./Components/Authentication/Signup"));
const Cart = lazy(() => import("./Pages/Cart"));
const Header = lazy(() => import("./Components/Header/Header"));
const Footer = lazy(() => import("./Components/Footer/Footer"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const ProductSearch = lazy(() => import("./Pages/ProductSearch"));
const Profile = lazy(() => import("./Pages/Profile/Profile"));
const EditProfile = lazy(() => import("./Pages/Profile/EditProfile"));
const UpdatePassword = lazy(() => import("./Pages/Profile/UpdatePassword"));
const ForgotPassword = lazy(() =>
  import("./Components/Authentication/ForgotPassword")
);
const ResetPassword = lazy(() =>
  import("./Components/Authentication/ResetPassword")
);
const Shipping = lazy(() => import("./Pages/Shipping"));
const ConfirmOrder = lazy(() => import("./Pages/ConfirmOrder"));
const Payment = lazy(() => import("./Pages/Payment"));
const OrderSuccess = lazy(() => import("./Pages/OrderSuccess"));
const Wishlist = lazy(() => import("./Pages/WishList"));
const UserOrders = lazy(() => import("./Pages/UserOrders/UserOrders"));
const OrderDetail = lazy(() => import("./Pages/UserOrders/OrderDetail"));
const Dashboard = lazy(() => import("./Pages/Admin Pages/NewProduct"));
const AdminProductList = lazy(() =>
  import("./Pages/Admin Pages/AdminProductList")
);
const AdminLayout = lazy(() => import("./Components/Admin/AdminLayout"));
const MainContent = lazy(() => import("./Pages/Admin Pages/MainContent"));
const NewProduct = lazy(() => import("./Pages/Admin Pages/NewProduct"));
const UpdateProduct = lazy(() => import("./Pages/Admin Pages/UpdateProduct"));
const OrdersList = lazy(() => import("./Pages/Admin Pages/OrdersList"));
const ErrorPage = lazy(() => import("./Components/ui/ErrorPage"));
const UpdateOrder = lazy(() => import("./Pages/Admin Pages/UpdateOrder"));
const AllUsers = lazy(() => import("./Pages/Admin Pages/AllUsers"));
const UpdateUser = lazy(() => import("./Pages/Admin Pages/UpdateUser"));
const Reviews = lazy(() => import("./Pages/Admin Pages/Reviews"));

function App() {
  const { data, isSuccess } = useGetStripeApiKeyQuery();
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    if (isSuccess && data?.stripeApiKey) {
      setStripeApiKey(data.stripeApiKey);
    }
  }, [data, isSuccess]);

  return (
    <Suspense
      fallback={
        <div className="p-4 animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-full"></div>
        </div>
      }
    >
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
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
