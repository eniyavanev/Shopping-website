import React from "react";
import { useGetProductsAdminQuery } from "../../Pages/Redux/Slices/apiProductSlice";
import { useGetAllOrdersAdminQuery } from "../Redux/Slices/apiorderSlice";
import { useGetAllUsersQuery } from "../Redux/Slices/apiAuthSlice";

const MainContent = () => {
  // Fetch data
  const { data } = useGetProductsAdminQuery();
  const products = data?.products || [];

  const { data: orders } = useGetAllOrdersAdminQuery();
  const ordersData = orders?.orders || [];

  const { data: users } = useGetAllUsersQuery();
  const usersData = users?.users || [];

  // Calculate out of stock
  let outOfStock = 0;
  products.forEach((product) => {
    if (product.stock === 0) outOfStock += 1;
  });

  // ✅ Calculate total amount from orders
  const totalAmount = ordersData.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );

  // ✅ Format total amount in INR
  const formattedTotalAmount = totalAmount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const stats = [
    { id: 1, title: "Total Amount", value: formattedTotalAmount },
    { id: 2, title: "Products", value: products.length },
    { id: 3, title: "Orders", value: ordersData.length },
    { id: 4, title: "Users", value: usersData.length },
    { id: 5, title: "Out of Stock", value: outOfStock },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Total Amount - Full width */}
      <div className="relative group bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-xl shadow-lg text-white text-center p-10 cursor-pointer">
        <h2 className="text-2xl font-semibold">{stats[0].title}</h2>
        <p className="text-6xl font-bold mt-4">{stats[0].value}</p>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-6 right-6 bg-white text-red-600 rounded-full px-6 py-2 font-semibold shadow-lg">
          View Detail
        </button>
      </div>

      {/* Other stats in grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {stats.slice(1).map(({ id, title, value }) => (
          <div
            key={id}
            className="relative group bg-white rounded-xl shadow-md text-center p-8 cursor-pointer hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-lg font-medium text-gray-700">{title}</h3>
            <p className="text-4xl font-extrabold mt-3">{value}</p>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-4 right-4 bg-red-500 text-white rounded-full px-4 py-1.5 font-semibold shadow-lg">
              View Detail
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
