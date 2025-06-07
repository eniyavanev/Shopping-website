import React, { useState } from "react";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../Redux/Slices/apiAuthSlice";
import Loader from "../../Components/Loader/Loader";
import usePageTitle from "../../Components/customHooks/PageTitle";
import { templatePdf } from "../../Utils/Pdf";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  usePageTitle("All Users");
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const users = data?.users || [];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleDownloadPDF = () => {
    const pdfHead = "All Users";

    const pdfData = [
      ["#", "User ID", "Name", "Email", "Role"], // Table Header
      ...users.map((user, index) => [
        index + 1,
        user._id,
        user.name,
        user.email,
        user.role,
      ]),
    ];

    templatePdf(pdfHead, pdfData, "All_Users");
  };

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;

  //Delete user
  const handleDelete = async (id) => {
    try {
      const response = await deleteUser(id).unwrap();
      refetch();
      toast.success(response?.message || "User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error?.data?.message || "Failed to delete user. Please try again."
      );
    }
  };
  return (
    <div className="p-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-4 py-2 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

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

        <button
          onClick={handleDownloadPDF}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          Download PDF
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow-md">
        <table className="min-w-full text-sm table-auto">
          <thead className="bg-purple-700 text-white uppercase text-left">
            <tr>
              <th className="px-6 py-3">User ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              currentUsers.map((user, idx) => (
                <tr
                  key={user._id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-3">{user._id}</td>
                  <td className="px-6 py-3">{user.name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">{user.role}</td>
                  <td className="px-6 py-3 space-x-3">
                    <button
                      onClick={() =>
                        navigate(
                          `/ProtectedRoutes/Admin/UpdateUser/${user._id}`
                        )
                      }
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
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

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="inline-flex space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-md hover:bg-purple-600 hover:text-white"
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
            className="px-3 py-1 border rounded-md hover:bg-purple-600 hover:text-white"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AllUsers;
