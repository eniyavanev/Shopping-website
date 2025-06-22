import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useGetSingleOrderQuery,
  useMarkOrderAsPaidMutation,
  useUpdateOrdersAdminMutation,
} from "../Redux/Slices/apiorderSlice";
import { statusColors, paymentStatusColors } from "../../Components/Data/Data";

const UpdateOrder = () => {
  const { id } = useParams();

  if (!id) return <p className="text-center py-10">Order not found</p>;

  const { data, isLoading: loadingOrder, refetch } = useGetSingleOrderQuery(id);
  const [updateOrdersAdmin, { isLoading: updating }] =
    useUpdateOrdersAdminMutation();
  const [markOrderAsPaid] = useMarkOrderAsPaidMutation();
  const [orderStatus, setStatus] = useState("Pending");

  const order = data?.order;

  useEffect(() => {
    if (order?.orderStatus) {
      setStatus(order.orderStatus);
    }
  }, [order?.orderStatus]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateOrdersAdmin({ id, orderStatus }).unwrap();
      toast.success(res.message || "Order status updated");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleMarkAsPaid = async () => {
    try {
      const res = await markOrderAsPaid(order._id).unwrap();
      toast.success("Order marked as paid");
      refetch();
    } catch (error) {
      toast.error("Failed to mark as paid");
    }
  };

  if (loadingOrder)
    return <p className="text-center py-10">Loading order...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Update Order Status
        </h2>

        {/* Customer & Order Summary */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Customer Info</h3>
            <p>
              <strong>Name:</strong> {order?.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {order?.user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {order?.shippingInfo?.phoneNo}
            </p>
            <p>
              <strong>Address:</strong> {order?.shippingInfo?.address},{" "}
              {order?.shippingInfo?.city}, {order?.shippingInfo?.state},{" "}
              {order?.shippingInfo?.pinCode}
            </p>
          </div>

          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Order Summary</h3>
            <p>
              <strong>Order ID:</strong> {order?._id}
            </p>
            <p>
              <strong>Items Price:</strong> ₹{order?.itemsPrice}
            </p>
            <p>
              <strong>Tax Price:</strong> ₹{order?.taxPrice}
            </p>
            <p>
              <strong>Shipping Price:</strong> ₹{order?.shippingPrice}
            </p>
            <p>
              <strong>Total Price:</strong> ₹{order?.totalPrice}
            </p>

            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium inline-block ${
                  paymentStatusColors[
                    order?.paymentInfo?.status?.toLowerCase()
                  ] || "bg-gray-200 text-gray-800"
                }`}
              >
                {order?.paymentInfo?.status === "succeeded"
                  ? "PAID"
                  : order?.paymentInfo?.status || "UNPAID"}
              </span>
            </p>

            {/* ✅ NEW LINE - PAYMENT METHOD DISPLAY */}
            <p>
              <strong>Payment Method:</strong>{" "}
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {order?.paymentInfo?.status === "Cash on Delivery"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </span>
            </p>

            {/* Cash on Delivery Display */}
            {order?.paymentInfo?.status === "Cash on Delivery" && (
              <p>
                <strong>Payment-Type:</strong>{" "}
                <span
                  className={
                    order?.isPaid
                      ? "text-green-600 bg-green-200 p-1 rounded-full"
                      : "text-red-600 bg-red-200 p-1 rounded-full"
                  }
                >
                  {order?.isPaid ? "PAID" : "UNPAID"}
                </span>
              </p>
            )}

            <p>
              <strong>Order Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium inline-block ${
                  statusColors[order?.orderStatus] ||
                  "bg-gray-200 text-gray-800"
                }`}
              >
                {order?.orderStatus}
              </span>
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Items in Order</h3>
          <div className="space-y-4">
            {order?.orderItems?.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 border p-4 rounded-lg"
              >
                <img
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Status Form */}
        <form onSubmit={handleUpdate} className="mt-10 space-y-4">
          <label className="block font-medium text-gray-700">
            Update Order Status
          </label>
          <select
            value={orderStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            type="submit"
            disabled={updating}
            className={`w-full text-white font-semibold py-3 rounded-lg transition duration-300 ${
              updating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </form>

        {/* Mark as Paid Button for COD */}
        {order?.paymentInfo?.status === "Cash on Delivery" &&
          !order?.isPaid && (
            <button
              onClick={handleMarkAsPaid}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Mark as Paid (COD)
            </button>
          )}
      </div>
    </div>
  );
};

export default UpdateOrder;
