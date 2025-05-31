// Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiHome, FiBox, FiChevronDown, FiUsers, FiShoppingCart, FiLogOut, FiMenu } from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden fixed left-4 top-4 z-50 bg-blue-700 text-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Sidebar"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-blue-900 text-white w-64 p-6
          transform md:translate-x-0
          transition-transform duration-300 ease-in-out
          z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          overflow-y-auto
          flex flex-col
        `}
      >
        <h2 className="text-2xl font-bold mb-8 border-b border-blue-700 pb-4">
          Dashboard
        </h2>

        <nav className="flex flex-col gap-4 text-lg flex-grow">
          <Link
            to="/ProtectedRoutes/Admin/Dashboard"
            className="flex items-center gap-3 hover:text-yellow-400 transition-colors duration-200"
            onClick={() => setIsOpen(false)} // close sidebar on mobile after click
          >
            <FiHome size={20} /> Home
          </Link>

          {/* Products dropdown */}
          <button
            onClick={() => setProductsOpen(!productsOpen)}
            className="flex items-center justify-between w-full gap-3 hover:text-yellow-400 transition-colors duration-200"
          >
            <span className="flex items-center gap-3">
              <FiBox size={20} />
              Products
            </span>
            <FiChevronDown
              size={18}
              className={`${productsOpen ? "rotate-180" : "rotate-0"} transition-transform duration-200`}
            />
          </button>
          {productsOpen && (
            <div className="ml-8 flex flex-col gap-2">
              <Link
                to="/ProtectedRoutes/Admin/AdminProductList"
                className="hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                Product List
              </Link>
              <Link
                to="/ProtectedRoutes/Admin/createProduct"
                className="hover:text-yellow-400"
                onClick={() => setIsOpen(false)}
              >
                Add Product
              </Link>
            </div>
          )}

          <Link
            to="/dashboard/orders"
            className="flex items-center gap-3 hover:text-yellow-400 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <FiShoppingCart size={20} /> Orders
          </Link>

          <Link
            to="/dashboard/users"
            className="flex items-center gap-3 hover:text-yellow-400 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <FiUsers size={20} /> Users
          </Link>
        </nav>

        <button
          className="flex items-center gap-3 hover:text-red-400 mt-auto"
          onClick={() => alert("Logging out...")}
        >
          <FiLogOut size={20} /> Logout
        </button>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
