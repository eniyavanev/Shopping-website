import React from "react";
import Button from "../Components/ui/Button";
import { Trash2, Minus, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
} from "./Redux/Slices/cartSlice";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import usePageTitle from "../Components/customHooks/PageTitle";

const Cart = () => {
  usePageTitle("Cart");
  const { items, taxPrice, shippingPrice, totalPrice } = useSelector(
    (state) => state.cart.cart
  );
  const user = useSelector((state) => state.protectRoute.user);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart!");
  };

  const handleIncreaseQtyWithStockCheck = (id) => {
    const product = items.find((item) => item._id === id);
    if (product.qty < product.stock) {
      dispatch(increaseQty(id));
    } else {
      toast.error("You have reached the maximum stock available!");
    }
  };

  const handleDecreaseQty = (id) => {
    dispatch(decreaseQty(id));
  };

  // Navigation
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (user) {
      navigate("/ProtectedRoutes/shipping");
    } else {
      navigate("/login?redirect=/ProtectedRoutes/shipping");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-pink-100 py-12 px-4 md:px-10">
      <h2 className="text-4xl font-bold text-center text-slate-800 mb-12 drop-shadow">
        🛒 Your Shopping Cart
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-8">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 border border-white/80"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-28 h-28 rounded-2xl object-contain shadow-md border border-gray-200 hover:scale-105 transition"
                />
                <div className="flex-1 w-full">
                  <Link to={`/ProductDetails/${item._id}`}>
                    <h3 className="text-xl font-semibold text-slate-900 hover:text-purple-600 transition">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-slate-700 mt-1">
                    ₹{item.price} x {item.quantity} ={" "}
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleDecreaseQty(item._id)}
                      className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQtyWithStockCheck(item._id)}
                      className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <Trash2
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="text-red-500 hover:text-red-600 cursor-pointer transition transform hover:scale-110"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        {items.length > 0 && (
          <div className="bg-white/50 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/70 h-fit sticky top-10">
            <h3 className="text-2xl font-bold text-center text-slate-800 mb-6">
              🧾 Order Summary
            </h3>
            <div className="space-y-4 text-slate-700 text-[17px]">
              <div className="flex justify-between">
                <span>Items Total Price</span>
                <span>
                  ₹{items.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{taxPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shippingPrice}</span>
              </div>
              <hr className="border-slate-300 my-4" />
              <div className="flex justify-between font-bold text-lg text-slate-900">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full mt-8 py-3 text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl transition"
            >
              🛍️ Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
