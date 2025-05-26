import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "./Redux/Slices/cartSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { countries } from "countries-list";
import CheckoutStepper from "../Components/Stepper/CheckoutStepper";

export const validateShippingForm = (formData) => {
  if (
    formData.address.trim() === "" ||
    formData.city.trim() === "" ||
    formData.state.trim() === "" ||
    formData.postalCode.trim() === "" ||
    formData.country.trim() === "" ||
    formData.phone.trim() === ""
  ) {
    toast.error("Please fill in all the shipping details!");
    return false;
  }
  return true;
};
const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingInfo } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const countryList = Object.entries(countries).map(([code, { name }]) => ({
    value: code,
    label: name,
  }));

  useEffect(() => {
    if (shippingInfo) {
      setFormData({
        address: shippingInfo.address || "",
        city: shippingInfo.city || "",
        state: shippingInfo.state || "",
        postalCode: shippingInfo.postalCode || "",
        country: shippingInfo.country || "",
        phone: shippingInfo.phone || "",
      });
    }
  }, [shippingInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateShippingForm(formData)) return;

    dispatch(saveShippingInfo(formData));
    toast.success("Shipping info saved successfully!");
    navigate("/ProtectedRoutes/ConfirmOrder");
  };

  return (
    <div>
      <CheckoutStepper activeStep={0} />
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Shipping Information
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Street Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Chennai"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Tamil Nadu"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="600001"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Country</option>
                {countryList.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2 mt-4">
              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition duration-200"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
