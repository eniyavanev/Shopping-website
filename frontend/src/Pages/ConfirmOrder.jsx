import React, { use } from "react";
import CheckoutStepper from "../Components/Stepper/CheckoutStepper";
import usePageTitle from "../Components/customHooks/PageTitle";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
  usePageTitle("Confirm Order");
  const { shippingInfo } = useSelector((state) => state.cart);
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice } =
    useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.protectRoute.user);
  //console.log("shippingInfo", shippingInfo);
  const navigate = useNavigate();

  const isShippingInfoValid =
    shippingInfo.phoneNo &&
    shippingInfo.address &&
    shippingInfo.city &&
    shippingInfo.state &&
    shippingInfo.country &&
    shippingInfo.pinCode;

  const handleProceedToPayment = () => {
    if (!isShippingInfoValid) {
      alert("Shipping information is missing. Please fill in all the details.");
      return;
    }
    const data = {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };
    sessionStorage.setItem("orderData", JSON.stringify(data));

    navigate("/ProtectedRoutes/Payment");
  };

  return (
    <div>
      <CheckoutStepper activeStep={1} />
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Confirm Your Order
          </h2>

          {!isShippingInfoValid && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-400 rounded">
              ❗ Shipping information is missing or incomplete. Please provide
              all details to proceed.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Shipping Info */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Shipping Information
              </h3>
              <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {user.name || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {shippingInfo.phoneNo || "Not provided"}
                </p>

                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {`${shippingInfo.address || "Not provided"}, ${
                    shippingInfo.city || "Not provided"
                  }, ${shippingInfo.state || "Not provided"}, ${
                    shippingInfo.country || "Not provided"
                  } - ${shippingInfo.pinCode || "Not provided"}`}
                </p>
              </div>

              <h3 className="text-lg font-semibold mt-8 mb-3 text-gray-800">
                Your Cart Items
              </h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <Link to={`/productDetails/${item._id}`} key={item._id}>
                    <div className="flex items-center gap-4 p-3 mb-3 border rounded-md bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × ₹{item.price} = ₹
                          {item.quantity * item.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Order Summary
              </h3>
              <div className="space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Items Price:</span>
                  <span>₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Charges:</span>
                  <span>₹{shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Price:</span>
                  <span>₹{taxPrice}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-blue-700">
                  <span>Total Amount:</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!isShippingInfoValid}
                className={`mt-6 w-full py-2 rounded-md transition text-white ${
                  isShippingInfoValid
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
