import React, { useState } from "react";
import { Eye } from "lucide-react";
import { useGetMyOrdersQuery } from "../Redux/Slices/apiorderSlice";
import { Link } from "react-router-dom";

const UserOrders = () => {
  const { data, isLoading, isError } = useGetMyOrdersQuery();

  const orders = data?.orders?.length
    ? data.orders.flatMap((order) =>
        order.orderItems.map((item) => ({
          orderId: order._id,
          status: order.orderStatus,
          orderDate: order.createdAt,
          product: item.name,
          quantity: item.quantity,
          price: item.price,
          id: item._id,
        }))
      )
    : [];

  const statusColors = {
    Delivered: "bg-green-100 text-green-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  const filteredOrders = orders.filter((order) =>
    order.product.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="p-4">
      {/* Search and Entries Control */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="flex items-center gap-2">
          <label
            htmlFor="entries"
            className="text-sm font-medium text-gray-700"
          >
            Show:
          </label>
          <select
            id="entries"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        {/* Desktop Table */}
        <table className="min-w-full table-auto border-collapse hidden md:table">
          <thead className="sticky top-0 bg-gradient-to-r from-purple-700 to-pink-600 text-white uppercase text-sm font-semibold tracking-wide shadow-lg">
            <tr>
              <th className="px-6 py-4 text-left">Order ID</th>
              <th className="px-6 py-4 text-left">Product</th>
              <th className="px-6 py-4 text-left">Quantity</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              currentOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-300 bg-white hover:shadow-md transition-shadow duration-300 ${
                    idx % 2 === 0 ? "bg-gray-100" : ""
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    #{order.orderId.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <Link to={`/productDetails/${order.id}`}>
                      {order.product}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{order.quantity}</td>
                  <td className="px-6 py-4 text-gray-700">₹{order.price}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[order.status] ||
                        "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to ={`/ProtectedRoutes/OrderDetail/${order.orderId}`} className="relative group flex justify-center items-center w-8 h-8 rounded-full text-blue-600 hover:text-blue-900 hover:bg-blue-100 cursor-pointer transition">
                      <Eye size={20} />
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 transform rounded bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
                        View
                      </span>
                    </Link >
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6 p-4">
          {currentOrders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            currentOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white"
              >
                <p className="text-gray-800 font-semibold">
                  Order ID: #{order.orderId.toUpperCase()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Product:</span>{" "}
                  <Link
                    to={`/productDetails/${order.id}`}
                    className="text-blue-600 underline"
                  >
                    {order.product}
                  </Link>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Quantity:</span>{" "}
                  {order.quantity}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Price:</span> ₹{order.price}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${
                      statusColors[order.status] || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
                <div className="flex gap-4 mt-3">
                  <div className="flex gap-4 mt-3">
                    <Link
                      to={`/ProtectedRoutes/OrderDetail/${order.orderId}`}
                      className="relative group flex justify-center items-center w-8 h-8 rounded-full text-blue-600 hover:text-blue-900 
hover:bg-blue-100 cursor-pointer transition"
                    >
                      <Eye size={20} />
                      <span
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 transform rounded bg-blue-700 px-3 py-1.5 
text-sm font-semibold text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap"
                      >
                        View
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 mb-4">
        <nav className="inline-flex space-x-2">
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
            }}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md bg-white text-gray-700 border-gray-300 hover:bg-purple-500 hover:text-white"
          >
            Previous
          </button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded-md border-gray-300 transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-purple-500 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === pages.length || pages.length === 0}
            className="px-3 py-1 border rounded-md bg-white text-gray-700 border-gray-300 hover:bg-purple-500 hover:text-white"
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, pages.length));
            }}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default UserOrders;
