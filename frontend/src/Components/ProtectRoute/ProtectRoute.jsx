import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ requiredRole }) => {
  const user = useSelector((state) => state.protectRoute.user);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Logged in but not the required role
    return <Navigate to="/" />; // or show unauthorized page
  }

  // Logged in and authorized
  return <Outlet />;
};

export default ProtectRoute;
