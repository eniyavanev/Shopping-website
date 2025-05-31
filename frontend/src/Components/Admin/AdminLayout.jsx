import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Pages/Admin Pages/Sidebar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const AdminLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-[250px] bg-gray-100 hidden md:block">
          <Sidebar />
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white p-4 space-y-4">
          {/* Outlet will render Dashboard or ProductList or others */}
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayout;
