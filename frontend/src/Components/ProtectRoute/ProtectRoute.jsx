import React from "react";
import {  useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = () => {
  
  const user = useSelector((state) => state.protectRoute.user);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectRoute;
