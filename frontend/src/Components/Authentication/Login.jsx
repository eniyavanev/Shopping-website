import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../Pages/Redux/Slices/apiAuthSlice";
import Loader from "../Loader/Loader";
import { toast } from "react-hot-toast";
import usePageTitle from "../customHooks/PageTitle";
import { setUser } from "../../Pages/Redux/Slices/protectRouteSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  // Set page title
  usePageTitle("Login");

  const [showPassword, setShowPassword] = useState(false); // Show/hide password
  const [formData, setFormData] = useState({ email: "", password: "" }); // Form state

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get redirect path from query param like: /login?redirect=/profile
  const redirectUrl = location.search ? location.search.split("=")[1] : "/";

  // RTK Query login mutation
  const [loginUser, { isLoading }] = useLoginUserMutation();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      // Call login API
      const res = await loginUser(formData).unwrap();

      // Extract user data and dispatch to Redux store
      const userData = {
        _id: res._id,
        name: res.name,
        email: res.email,
        role: res.role,
        avatar: res.avatar,
        token: res.token,
        createdAt: res.createdAt,
      };

      dispatch(setUser(userData)); // Set user in Redux

      toast.success(res.data?.message || "Login successful!");

      // ✅ Redirect to intended route or homepage
      navigate(redirectUrl);
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Show loader if logging in
  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Welcome Back 👋
        </h2>

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              autoComplete="off"
              value={formData.email}
              onChange={handleChange}
               onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/ForgotPassword"
              className="text-sm text-blue-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="••••••••"
              autoComplete="off"
              value={formData.password}
              onChange={handleChange}
               onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {/* Toggle show/hide password */}
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition duration-200"
          >
            {isLoading ? <Loader /> : "Login"}
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-700 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
