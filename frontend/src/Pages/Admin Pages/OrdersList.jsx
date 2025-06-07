import React, { useState } from "react";
import { Pencil, Trash2, FileDown } from "lucide-react";
import {
  useGetAllOrdersAdminQuery,
  useDeleteOrdersAdminMutation,
} from "../Redux/Slices/apiorderSlice";
import { toast } from "react-hot-toast";
import { templateExcel } from "../../Utils/Excel";
import { useNavigate } from "react-router-dom";
import { statusColors } from "../../Components/Data/Data";

const OrdersList = () => {
  const navigate = useNavigate();
  const {
    data,
    isLoading: isOrdersLoading,
    isError,
    refetch,
  } = useGetAllOrdersAdminQuery();

  const [deleteOrdersAdmin] = useDeleteOrdersAdminMutation();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const orders =
    data?.orders?.map((order) => {
      const totalItems = order.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return {
        orderId: order._id,
        totalItems,
        amount: order.totalPrice,
        status: order.orderStatus,
        date: new Date(order.createdAt).toLocaleString(),
      };
    }) || [];

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleEdit = (orderId) => {
    navigate(`/ProtectedRoutes/Admin/UpdateOrder/${orderId}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteOrdersAdmin(id).unwrap();
      refetch();
      toast.success(response?.message || "Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(
        error?.data?.message || "Failed to delete order. Please try again."
      );
    }
  };

  const handleDownloadExcel = () => {
    const tableData = [
      ["Order ID", "Items Ordered", "Amount", "Status", "Date"],
      ...filteredOrders.map((order) => [
        order.orderId,
        order.totalItems,
        order.amount,
        order.status,
        order.date,
      ]),
    ];

    templateExcel("Orders_List", "Orders", tableData);
  };

  if (isOrdersLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to load orders.</p>;

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search order ID..."
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
            {[2, 5, 10].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <FileDown size={18} />
          Export to Excel
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200">
        <table className="min-w-full table-auto border-collapse table">
          <thead className="bg-gradient-to-r from-purple-700 to-pink-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left">Order ID</th>
              <th className="px-6 py-4 text-left">Items Ordered</th>
              <th className="px-6 py-4 text-left">Amount</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              currentOrders.map((order, idx) => (
                <tr
                  key={order.orderId}
                  className={`border-b transition duration-300 ${
                    idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-purple-50`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    #{order.orderId.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {order.totalItems}
                  </td>
                  <td className="px-6 py-4 text-gray-700">₹{order.amount}</td>
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
                  <td className="px-6 py-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(order.orderId)}
                      className="hover:text-green-600"
                      title="Edit Order"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(order.orderId)}
                      className="hover:text-red-600"
                      title="Delete Order"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <div className="inline-flex rounded-md border border-gray-300 shadow-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || totalPages === 1}
            className="px-3 py-1 disabled:opacity-50 hover:bg-purple-500 hover:text-white"
          >
            Prev
          </button>

          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border-l border-gray-300 hover:bg-purple-500 hover:text-white ${
                currentPage === page
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 1}
            className="px-3 py-1 border-l border-gray-300 disabled:opacity-50 hover:bg-purple-500 hover:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
