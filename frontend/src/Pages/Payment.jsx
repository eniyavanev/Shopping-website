import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useProcessPaymentMutation } from "./Redux/Slices/apiPaymentSlice";
import { orderCompleted } from "./Redux/Slices/cartSlice";
import usePageTitle from "../Components/customHooks/PageTitle";
import { useCreateOrderMutation } from "./Redux/Slices/apiorderSlice";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#374151",
      "::placeholder": { color: "#9CA3AF" },
    },
    invalid: { color: "#EF4444" },
  },
};

const Payment = () => {
  usePageTitle("Payment");
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "cod"
  const [cardComplete, setCardComplete] = useState(false);
  const [processPayment, { isLoading }] = useProcessPaymentMutation();
  const [createOrder, { isLoading: isLoadingOrder, isError: isErrorOrder }] = useCreateOrderMutation();

  const { user } = useSelector((state) => state.protectRoute);
  const { shippingInfo, cart } = useSelector((state) => state.cart);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderData"));
  const { totalPrice } = cart;

  const order = {
    orderItems: cart.items,
    shippingInfo,
    ...(orderInfo && {
      itemsPrice: orderInfo.itemsPrice,
      shippingPrice: orderInfo.shippingPrice,
      taxPrice: orderInfo.taxPrice,
      totalPrice: orderInfo.totalPrice,
    }),
  };

  if (isErrorOrder) {
    toast.error("Failed to create the order. Please try again.");
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-red-600 text-center text-lg font-medium">
          Unable to process your order at the moment. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();

    // If Cash on Delivery selected
    if (paymentMethod === "cod") {
      const paymentInfo = {
        id: "COD-" + new Date().getTime(),
        status: "Cash on Delivery",
      };

      try {
        await createOrder({ ...order, paymentInfo }).unwrap();
        dispatch(orderCompleted());
        toast.success("Order placed with Cash on Delivery!");
        navigate("/ProtectedRoutes/order/success");
      } catch (error) {
        toast.error("Failed to place COD order.");
        console.error(error);
      }
      return;
    }

    // Stripe Card Payment
    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const amount = Math.round(totalPrice * 100);
      const shipping = {
        name: user.name,
        address: {
          line1: shippingInfo.address,
          city: shippingInfo.city,
          postal_code: shippingInfo.postalCode,
          country: shippingInfo.country,
        },
        phone: shippingInfo.phone,
      };

      const res = await processPayment({ amount, shipping }).unwrap();
      const clientSecret = res.clientSecret;

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user.name,
              email: user.email,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                postal_code: shippingInfo.postalCode,
                country: shippingInfo.country,
              },
              phone: shippingInfo.phone,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        order.paymentInfo = {
          id: paymentIntent.id,
          status: paymentIntent.status,
        };

        try {
          await createOrder(order).unwrap();
          dispatch(orderCompleted());
          toast.success("Payment successful!");
          navigate("/ProtectedRoutes/order/success");
        } catch (orderError) {
          toast.error("Payment succeeded, but order creation failed.");
          console.error("Order creation error:", orderError);
        }
      } else {
        toast.error("Payment failed: " + paymentIntent.status);
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Complete Your Payment
        </h2>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-4">
            <label className="block text-gray-700 font-medium">
              Select Payment Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <span>Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Card Payment Section */}
          {paymentMethod === "card" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Card Information
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 focus-within:ring-2 ring-indigo-500">
                <CardElement
                  options={CARD_ELEMENT_OPTIONS}
                  onChange={(e) => setCardComplete(e.complete)}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={
              isLoading ||
              (paymentMethod === "card" && (!stripe || !cardComplete))
            }
            className={`w-full bg-indigo-600 text-white font-semibold text-lg py-3 rounded-lg transition 
              ${
                isLoading ||
                (paymentMethod === "card" && (!stripe || !cardComplete))
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700"
              }`}
          >
            {isLoading
              ? "Processing..."
              : paymentMethod === "cod"
              ? "Place Order (COD)"
              : `Pay Now $${Math.round(totalPrice)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
