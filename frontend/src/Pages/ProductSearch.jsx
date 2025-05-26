import React, { useState } from "react";
import usePageTitle from "../Components/customHooks/PageTitle";
import { useGetProductsQuery } from "./Redux/Slices/apiProductSlice";
import Loader from "../Components/Loader/Loader";
import Product from "../Components/Product/Product";
import ReactPaginate from "react-paginate";
import { useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Rating from "../Components/Rating/Rating";

const ProductSearch = () => {
  usePageTitle("Product Search");
  const { keyword } = useParams();
  const [currentPage, setCurrentPage] = useState(0);

  // Range Filter State
  const [priceRange, setPriceRange] = useState([1, 50000]);
  //console.log("priceRange",priceRange);

  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  // Data Fetching with price range included
  const { data, isLoading, isError, isSuccess, error } = useGetProductsQuery({
    keyword,
    price: priceRange,
    category,
    rating,
    page: currentPage + 1,
  });

  const { products = [], count = 0, resultPerPage = 7 } = data || {};
  const pageCount = Math.ceil(count / resultPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Range Filter Handlers

  //handleMinPriceChange - na input la change panra minium price string ah varumnu athanumber ah chnage panrom , pannathukku apram na 95000 min price choose aana maximum price 90000 thaan irukkuna rendula ethula minimum price nu  paathu 90000  thaan minimum eduthu athula 1 ah minus panni atha state la set pannidum
  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 1);
    //console.log("value", value);
    //console.log("priceRange[1]", priceRange[1]);

    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 1);
    setPriceRange([priceRange[0], value]);
  };

  //Category Filter
  const categories = [
    "Electronics",
    "MobilePhones",
    "Cameras",
    "Laptops",
    "Accessories",
    "Headphones",
    "Food",
    "Books",
    "Clothes/Shoes",
    "Beauty/Health",
    "Sports",
    "Outdoor",
    "HomeAppliances",
  ];

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    //console.log("Selected Category:", selected);
    setCurrentPage(0); // reset to first page
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        Searched Products
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1 bg-white shadow-lg p-6 rounded-2xl border border-gray-100 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2 text-lg font-bold text-blue-700">
            <SlidersHorizontal className="w-5 h-5" />
            Filters
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm">
              Category
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm">
              Price Range
            </label>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={25000}
                value={priceRange[0]}
                onChange={handleMinPriceChange}
                className="accent-blue-600 w-full"
              />
              <input
                type="range"
                min={26000}
                max={50000}
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                className="accent-blue-600 w-full"
              />
            </div>

            <div className="flex justify-between text-sm text-gray-600 font-semibold">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium text-sm">Rating</label>
            <ul className="flex flex-col  gap-2 pt-2 text-yellow-300 text-xl">
              {[5, 4, 3, 2, 1].map((star) => (
                <li key={star} className="cursor-pointer" onClick={() => setRating(star)}>
                  <Rating value={star} />
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products Section */}
        <div className="lg:col-span-3">
          {isLoading && <Loader />}

          {isError && (
            <p className="text-red-500 text-lg">
              Error loading products:{" "}
              {error?.data?.message || "Something went wrong"}
            </p>
          )}

          {isSuccess && products.length === 0 && (
            <p className="text-gray-600">No products available.</p>
          )}

          {isSuccess && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <Product key={product._id} product={product} index={index} />
                ))}
              </div>

              {count > 7 && (
                <div className="flex justify-center mt-10 cursor-pointer">
                  <ReactPaginate
                    previousLabel={"← Prev"}
                    nextLabel={"Next →"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    forcePage={currentPage}
                    containerClassName="flex justify-center items-center gap-2 mt-10 flex-wrap"
                    pageClassName="text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                    pageLinkClassName="block"
                    activeClassName="bg-blue-600 text-white border-blue-600"
                    previousClassName="text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                    nextClassName="text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200"
                    breakClassName="px-3 py-2 text-gray-500"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSearch;
