import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-green-100 to-white px-4">
      <div className="bg-white shadow-2xl p-8 rounded-2xl text-center max-w-md w-full animate-fade-in-up">
        <CheckCircle className="text-green-600 mx-auto mb-4" size={60} />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
