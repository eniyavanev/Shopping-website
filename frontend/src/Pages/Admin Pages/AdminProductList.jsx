import React, { useState } from "react";
import {
  useDeleteSingleProductMutation,
  useGetProductsAdminQuery,
} from "../Redux/Slices/apiProductSlice";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import usePageTitle from "../../Components/customHooks/PageTitle";
import toast from "react-hot-toast";
import Loader from "../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { templatePdf } from "../../Utils/Pdf";

const AdminProductList = () => {
  usePageTitle("Admin Product List");
  const navigate = useNavigate();
  const { data, isLoading } = useGetProductsAdminQuery();
  const allProducts = data?.products || [];

  const [deleteSingleProduct, { isLoading: isDeleting }] =
    useDeleteSingleProductMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / entriesPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const result = await deleteSingleProduct(productId).unwrap();
      if (result) {
        toast.success(result?.message || "Product deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleDownloadPdf = () => {
    const pdfhead = "Admin Product List";
    const tablebody = [
      ["#", "Product Name", "Price", "Stock"],
      ...filteredProducts.map((product, i) => [
        i + 1,
        product.name,
        `₹${product.price}`,
        product.stock.toString(),
      ]),
    ];
    const paperAngle = "portrait";
    templatePdf(pdfhead, tablebody, paperAngle);
  };

  if (isDeleting) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">
          🛒 Admin Product List
        </h2>
        <button
          onClick={handleDownloadPdf}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaDownload />
          Download PDF
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Show Entries */}
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-gray-700 font-medium">
            Show
          </label>
          <select
            id="entries"
            value={entriesPerPage}
            onChange={handleEntriesChange}
            className="border rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-300"
          >
            {[5, 10, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="text-gray-700">entries</span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search by product name..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-100 text-gray-800 text-left text-sm font-semibold uppercase">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-red-600 font-medium"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={`${
                    index % 2 !== 0 ? "bg-gray-200" : "bg-white"
                  } hover:bg-blue-50 transition duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {product._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-center space-x-3">
                    <button
                      onClick={() =>
                        navigate(
                          `/ProtectedRoutes/Admin/UpdateProduct/${product._id}`
                        )
                      }
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-500 hover:text-red-700 transition"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 flex-wrap gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 text-sm rounded border transition ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProductList;
