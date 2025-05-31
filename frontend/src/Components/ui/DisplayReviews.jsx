import React from "react";
import { useGetSingleProductReviewsQuery } from "../../Pages/Redux/Slices/apiProductSlice";
import { FaStar } from "react-icons/fa";

const DisplayReviews = ({ id }) => {
  const { data, isLoading, isError } = useGetSingleProductReviewsQuery(id);
  const reviews = data?.reviews || [];

  if (isLoading)
    return (
      <p className="text-center py-10 text-gray-400 font-medium animate-pulse">
        Loading reviews...
      </p>
    );

  if (isError || !data?.success)
    return (
      <p className="text-center py-10 text-red-600 font-semibold">
        Failed to load reviews.
      </p>
    );

  return (
    <div className="mt-12 max-w-5xl mx-auto px-6">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center tracking-wide">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-center italic text-gray-500 text-lg">
          No reviews yet. Be the first to share your experience!
        </p>
      ) : (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-lg p-8 border border-indigo-200 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              {/* User Info */}
              {review.user && (
                <div className="flex items-center space-x-4 mb-5">
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-indigo-400 shadow-md"
                  />
                  <div>
                    <p className="text-xl font-semibold text-indigo-900">
                      {review.user.name}
                    </p>
                    {review.createdAt && (
                      <p className="text-sm text-indigo-500">
                        {new Date(review.createdAt).toLocaleDateString(//This method converts the Date object into a human-readable date string based on your local settings (language, format).
                          undefined, //This means "use the default locale of the user’s browser."
                          {
                            year: "numeric",//show full year (like 2025)
                            month: "long", //show full month name (like "May")
                            day: "numeric", // show day as number (like 31)
                            
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`text-3xl mr-1 ${
                      review.rating >= star
                        ? "text-indigo-500"
                        : "text-indigo-200"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <blockquote className="text-indigo-700 italic text-lg leading-relaxed relative before:content-['“'] before:absolute before:-top-6 before:-left-4 before:text-6xl before:text-indigo-200 before:font-serif after:content-['”'] after:absolute after:-bottom-6 after:-right-4 after:text-6xl after:text-indigo-200 after:font-serif">
                {review.comment}
              </blockquote>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisplayReviews;
