import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-hot-toast";
import { useGetSingleUserQuery, useUpdateUserMutation } from "../Redux/Slices/apiAuthSlice";
import { useSelector } from "react-redux";

const UpdateUser = () => {
  const { id:userId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetSingleUserQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();


  //Login user
       const user = useSelector((state) => state.protectRoute.user);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (data?.user) {
      setForm({
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const res = await updateUser({ userId, form }).unwrap();
      toast.success(res?.message||"User updated successfully");
      navigate("/ProtectedRoutes/Admin/AllUsers");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  if (isLoading) return <p className="text-center">Loading user...</p>;
  if (error) return <p className="text-center text-red-500">Error loading user</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">Update User</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            disabled={userId === user._id}
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="User">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
        >
          {isUpdating ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
