import React, { useState } from "react";
import usePageTitle from "../Components/customHooks/PageTitle";
import { useGetProductsQuery } from "./Redux/Slices/apiProductSlice";
import Loader from "../Components/Loader/Loader";
import Product from "../Components/Product/Product";
import ReactPaginate from "react-paginate";
import { hasSeenLoginModal, setLoginModalSeen } from "../Utils/modalHelper";
import { useEffect } from "react";
import Modal from "../Components/ui/Modal";
import { AnimatePresence } from "framer-motion";

const Home = () => {
  usePageTitle("Home");
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, isError, isSuccess, error } = useGetProductsQuery({
    keyword: null,
    price: null,
    category: null, // product search pannum bothu ithe api use panrathala intha parameter la anga keyword use panrom home page la use pannathathunala inga null use panrom
    rating: null,
    page: currentPage + 1, // ReactPaginate is 0-based, backend is 1-based
  });

  const { products = [], count = 0, resPerPage = 7 } = data || {}; // default values set panrom
  const pageCount = Math.ceil(count / resPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //Modal Logics
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    //session storage la loginseen modal illana modal kaamikanum iruntha kaatakoodathu
    if (!hasSeenLoginModal()) {
      setShowModal(true);
      setLoginModalSeen(); // mark it as seen
    }
  }, []);

  return (
    <>
      {/* Modal component */}
      <AnimatePresence>
        {showModal && <Modal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
      <section className="max-w-7xl mx-auto px-4 py-8 bg-primary">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Latest Products
        </h1>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  forcePage={currentPage} // to control page selection from state
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
      </section>
    </>
  );
};

export default Home;
