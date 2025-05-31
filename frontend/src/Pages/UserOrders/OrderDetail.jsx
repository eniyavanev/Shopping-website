import React from "react";
import { Link, useParams } from "react-router-dom";
import { useGetSingleOrderQuery } from "../Redux/Slices/apiorderSlice";
import Loader from "../../Components/Loader/Loader";

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSingleOrderQuery(id);
  console.log("data", data);

  const order = data?.order;

  const statusColors = {
    Delivered: "bg-green-100 text-green-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  if (isLoading) return <Loader />;
  if (isError || !order)
    return (
      <p className="text-center py-10 text-red-500">Failed to load order.</p>
    );

  const total = order.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-md rounded-lg mt-6">
      <div className="mb-4">
        <Link
          to="/ProtectedRoutes/UserOrders"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Orders
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-purple-700">Order Summary</h2>

      <div className="space-y-2 mb-6">
        <p>
          <span className="font-medium text-gray-600">Order ID:</span> #
          {order._id}
        </p>
        <p>
          <span className="font-medium text-gray-600">Order Date:</span>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-medium text-gray-600">Status:</span>{" "}
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
              statusColors[order.orderStatus] || "bg-gray-200 text-gray-700"
            }`}
          >
            {order.orderStatus}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-600">Customer:</span>{" "}
          {order.user?.name} ({order.user?.email})
        </p>
        <p>
          <span className="font-medium text-gray-600">Shipping Address:</span>{" "}
          {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
        </p>
        <p>
          <span className="font-medium text-gray-600">Phone:</span>{" "}
          {order.shippingInfo.phoneNo}
        </p>
        <p>
          <span className="font-medium text-gray-600">Payment ID:</span>{" "}
          {order.paymentInfo?.id}
        </p>
        <p>
          <span className="font-medium text-gray-600">Payment Status:</span>{" "}
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
              order.paymentInfo?.status === "succeeded"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {order.paymentInfo?.status === "succeeded" ? "Paid" : "Not Paid"}
          </span>
        </p>
        <p>
          <span className="font-medium text-gray-600">Paid At:</span>{" "}
          {new Date(order.paidAt).toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        {order.orderItems.map((item, index) => (
          <div
            key={item._id || index}
            className="flex items-center justify-between border rounded-md p-3 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-16 h-16 rounded object-cover border"
              />
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold text-purple-600">₹{item.price}</p>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Subtotal</span>
          <span>₹{order.itemsPrice}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Tax</span>
          <span>₹{order.taxPrice}</span>
        </div>
        <div className="flex justify-between text-gray-700 mb-2">
          <span>Shipping Fee</span>
          <span>₹{order.shippingPrice}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-purple-800 border-t pt-2">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
