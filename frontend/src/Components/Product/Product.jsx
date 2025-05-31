import React from "react";
import Rating from "../Rating/Rating";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../Pages/Redux/Slices/whistlelist";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Product = ({ product, index }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      toast.error("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  return (
    <div
      key={product._id}
      className={`relative bg-${
        index % 2 === 0 ? "" : ""
      }-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200`}
    >
      {/* Wishlist Icon */}
      <div
        className="absolute top-2 right-2 cursor-pointer z-10"
        onClick={handleWishlist}
      >
        {isWishlisted ? (
          <FaHeart className="text-blue-700 text-xl" />
        ) : (
          <FaRegHeart className="text-gray-500 text-xl hover:text-blue-600" />
        )}
      </div>

      <img
        src={product.images[0]?.image || "/images/default.jpg"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-t-xl"
      />
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <div className="flex items-center text-yellow-500">
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
