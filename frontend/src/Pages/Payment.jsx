// src/Pages/Payment.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useProcessPaymentMutation } from "./Redux/Slices/apiPaymentSlice";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#4B5563",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#EF4444",
    },
  },
};

const Payment = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [processPayment, { isLoading }] = useProcessPaymentMutation();

  const { user } = useSelector((state) => state.protectRoute);
  const { shippingInfo, cart } = useSelector((state) => state.cart);
  const { totalPrice } = cart;

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      // Step 1: Create payment intent on backend
      const amount = Math.round(totalPrice * 100); // Convert to cents
      const shipping = {
        name: user.name,
        address: {
          line1: shippingInfo.address,
          city: shippingInfo.city,
          postal_code: shippingInfo.postalCode,
          country: shippingInfo.country,
        },
      };

      const res = await processPayment({ amount, shipping }).unwrap();
      const clientSecret = res.clientSecret;

      // Step 2: Confirm card payment on frontend
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.name,
              email: user.email,
            },
          },
        }
      );

      if (error) {
        alert(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        navigate("/ProtectedRoutes/order/success");
      } else {
        alert("Payment not successful, status: " + paymentIntent.status);
      }
    } catch (err) {
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Payment Details
        </h2>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Card Details</label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>

          <button
            type="submit"
            disabled={!stripe || isLoading}
            className={`w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
