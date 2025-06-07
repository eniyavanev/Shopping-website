import React, { useState } from "react";
import { Eye } from "lucide-react";
import { useGetMyOrdersQuery } from "../Redux/Slices/apiorderSlice";
import { Link } from "react-router-dom";

const UserOrders = () => {
  const { data, isLoading, isError } = useGetMyOrdersQuery();
  const orders = data?.orders || [];

  const statusColors = {
    Delivered: "bg-green-100 text-green-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  // Filter by product name
  const filteredOrders = orders.filter((order) =>
    order.orderItems.some((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    )
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
      {/* Search and Entries */}
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
          <label htmlFor="entries" className="text-sm font-medium text-gray-700">
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

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
        <table className="min-w-full table-auto border-collapse hidden md:table">
          <thead className="sticky top-0 bg-gradient-to-r from-purple-700 to-pink-600 text-white uppercase text-sm font-semibold tracking-wide shadow-lg">
            <tr>
              <th className="px-6 py-4 text-left">Order Info</th>
              <th className="px-6 py-4 text-left">Items</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              currentOrders.map((order, idx) => (
                <tr
                  key={order._id}
                  className={`border-b border-gray-300 bg-white hover:shadow-md duration-300 ${
                    idx % 2 === 0 ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold">#{order._id.toUpperCase()}</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                        statusColors[order.orderStatus] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item._id}>
                        <Link to={`/productDetails/${item._id}`} className="text-blue-600 font-medium hover:underline">
                          {item.name}
                        </Link>{" "}
                        x {item.quantity} – ₹{item.price}
                      </div>
                    ))}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    ₹{order.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/ProtectedRoutes/OrderDetail/${order._id}`}
                      className="relative group flex justify-center items-center w-8 h-8 rounded-full text-blue-600 hover:text-blue-900 hover:bg-blue-100 cursor-pointer transition"
                    >
                      <Eye size={20} />
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 transform rounded bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
                        View
                      </span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Mobile Version */}
        <div className="md:hidden space-y-6 p-4">
          {currentOrders.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            currentOrders.map((order) => (
              <div key={order._id} className="border p-4 rounded-md bg-white shadow-sm">
                <div className="mb-2">
                  <p className="text-sm font-semibold">
                    Order ID: #{order._id.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                      statusColors[order.orderStatus] || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <div className="space-y-1">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="text-sm">
                      <Link to={`/productDetails/${item._id}`} className="text-blue-600 font-medium hover:underline">
                        {item.name}
                      </Link>{" "}
                      x {item.quantity} – ₹{item.price}
                    </div>
                  ))}
                </div>
                <div className="mt-2 font-semibold">Total: ₹{order.totalPrice}</div>
                <div className="flex justify-end mt-2">
                  <Link
                    to={`/ProtectedRoutes/OrderDetail/${order._id}`}
                    className="flex items-center text-blue-600 hover:text-blue-900"
                  >
                    <Eye size={20} className="mr-1" />
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 mb-4">
        <nav className="inline-flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md bg-white text-gray-700 border-gray-300 hover:bg-purple-500 hover:text-white disabled:opacity-50"
          >
            Previous
          </button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded-md border-gray-300 transition ${
                currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-purple-500 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded-md bg-white text-gray-700 border-gray-300 hover:bg-purple-500 hover:text-white disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default UserOrders;
