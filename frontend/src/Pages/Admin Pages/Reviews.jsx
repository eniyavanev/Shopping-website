import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import usePageTitle from "../../Components/customHooks/PageTitle";
import {
  useDeleteReviewMutation,
  useGetSingleProductReviewsAdminQuery,
} from "../Redux/Slices/apiProductSlice";
import toast from "react-hot-toast";

const Reviews = () => {
  usePageTitle("All Reviews");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetSingleProductReviewsAdminQuery(
    searchValue,
    {
      skip: !searchValue,
    }
  );

  const reviews = data?.reviews || [];
  const [deleteReview] = useDeleteReviewMutation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchValue(searchTerm.trim());
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = reviews.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (id) => {
    try {
      const productId = searchValue?.toString();
      const reviewId = id?.toString();

      const response = await deleteReview({ productId, reviewId }).unwrap();
      toast.success(response?.message || "Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(
        error?.data?.message || "Failed to delete review. Please try again."
      );
    }
  };

  if (isLoading)
    return <div className="p-4 text-center">Loading reviews...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-600 text-center">
        Failed to fetch reviews
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-purple-700 text-center md:text-left">
        All Reviews
      </h2>

      {/* Search form */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col md:flex-row md:justify-between gap-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <input
            type="text"
            placeholder="Enter Product ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-md w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm font-medium">
            Show:
          </label>
          <select
            id="entries"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {[5, 10, 20].map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Table */}
      <div className="w-full overflow-x-auto border rounded-lg shadow">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-purple-700 text-white uppercase text-left">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Product ID</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No reviews found.
                </td>
              </tr>
            ) : (
              currentReviews.map((review, index) => (
                <tr
                  key={review._id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-3 text-xs md:text-sm">
                    {review.user?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm">
                    {searchValue || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm">
                    {searchValue || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm">
                    {review.rating} / 5
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm">
                    {review.comment}
                  </td>
                  <td className="px-4 py-3 text-xs md:text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-2 sm:hidden text-center">
        Scroll right to view more →
      </p>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="flex flex-wrap gap-2 justify-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-md hover:bg-purple-600 hover:text-white disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded-md ${
                page === currentPage
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-500 hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded-md hover:bg-purple-600 hover:text-white disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Reviews;
