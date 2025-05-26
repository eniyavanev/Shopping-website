import React from "react";
import Rating from "../Rating/Rating";
import { Link } from "react-router-dom";

const Product = ({ product, index }) => {
  return (
    <div
      key={product._id}
      className={`bg-${
        index % 2 === 0 ? "blue" : "yellow"
      }-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200`}
    >
      <img
        src={product.images[0]?.image || Watch}
        alt={product.name}
        className="w-full h-40 object-cover rounded-t-xl"
      />
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <div className="flex items-center  text-yellow-500">
          <Rating value={product.ratings} text={product.numOfReviews} />
        </div>
        <p className="text-lg font-bold text-blue-700">₹{product.price}</p>
        <Link to={`/ProductDetails/${product._id}`}>
          <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded mt-2 transition duration-200">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Product;
