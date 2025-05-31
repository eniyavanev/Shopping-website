import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Rating from "../Components/Rating/Rating";
import Loader from "../Components/Loader/Loader";
import usePageTitle from "../Components/customHooks/PageTitle";
import {
  useCreateReviewMutation,
  useGetSingleProductQuery,
} from "./Redux/Slices/apiProductSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./Redux/Slices/cartSlice";
import { toast } from "react-hot-toast";
import ReviewModal from "../Components/ui/ReviewModal";
import DisplayReviews from "../Components/ui/DisplayReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Set page title for SEO and UX
  usePageTitle("Product Details");

  const user = useSelector((state) => state.protectRoute.user);

  // Fetch product data using RTK Query hook
  const { data, isLoading, isError } = useGetSingleProductQuery(id);

  //review Query
  const [
    createReview,
    { isLoading: reviewLoading, isError: reviewError, refetch },
  ] = useCreateReviewMutation();

  // Local state for selected image & quantity
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  // review
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // When product data arrives, set the initial selected image
  useEffect(() => {
    if (data?.product?.images?.length > 0) {
      setSelectedImage(data.product.images[0].image);
    }
  }, [data]);

  // Safely access product for ease of use later
  const product = data?.product;

  // Handle quantity changes respecting stock limits
  const incrementquantity = () => {
    if (product && quantity < product.stock) setQuantity(quantity + 1);
  };

  const decrementquantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Add to cart handler - can be extended to dispatch to Redux or call APIs
  const handleAddToCart = () => {
    console.log("DISPATCHING ITEM:", { ...product, quantity });
    dispatch(addToCart({ ...product, quantity }));
    toast.success("Item added to cart!");
  };

  // Render loading state
  if (isLoading) {
    return <Loader />;
  }

  // Render error state
  if (isError) {
    return (
      <div className="text-center mt-20 text-red-600 text-lg">
        Error loading product!
      </div>
    );
  }

  // If no product found
  if (!product) {
    return <div className="text-center mt-20 text-lg">Product not found.</div>;
  }

  //review handler
  const handleReviewSubmit = async ({ comment, rating }) => {
    try {
      await createReview({ productId: product._id, comment, rating }).unwrap();
      setIsReviewModalOpen(false);
      refetch();
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };
  return (
    <>
      <section className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left side: Product Images */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-[400px] object-contain rounded-lg shadow-lg mb-4"
          />
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img.image}
                alt={`${product.name} ${idx + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === img.image
                    ? "border-blue-600"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(img.image)}
              />
            ))}
          </div>
        </div>

        {/* Right side: Product Details */}
        <div className="flex flex-col justify-start">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-2 text-yellow-300">
            <Rating value={product.ratings} text={`${product.numOfReviews}`} />
          </div>

          <p className="text-2xl font-semibold text-green-700 mb-4">
            ${product.price}
          </p>

          <p className="mb-4 text-gray-700">{product.description}</p>

          {/* quantity selector */}
          <div className="flex items-center mb-6 space-x-4">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border rounded">
              <button
                onClick={decrementquantity}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition rounded-l"
              >
                -
              </button>
              <input
                type="text"
                readOnly
                value={quantity}
                className="w-12 text-center border-x py-1"
              />
              <button
                onClick={incrementquantity}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition rounded-r"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock status */}
          {product.stock > 0 ? (
            <p className="mb-4 text-green-600 font-semibold">In Stock</p>
          ) : (
            <p className="mb-4 text-red-600 font-semibold">Out of Stock</p>
          )}

          {/* Add to Cart button */}
          <button
            disabled={product.stock === 0}
            onClick={handleAddToCart}
            className="px-6 py-3 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>

          {/* Submit review button */}
          {user ? (
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-6 py-3 mt-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 mt-4 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Login to submit review
            </button>
          )}

          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            onSubmit={handleReviewSubmit}
          />
        </div>
      </section>
      <DisplayReviews id={id} />
    </>
  );
};

export default ProductDetails;
