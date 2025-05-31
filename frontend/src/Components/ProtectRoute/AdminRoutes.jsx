import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const user = useSelector((state) => state.protectRoute.user);

  if (!user) {
    // Not logged in at all
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    // Logged in but not admin
    return <Navigate to="/" />; // Redirect to home or some "not authorized" page
  }

  // User is admin, allow access
  return <Outlet />;
};

export default AdminRoutes;
