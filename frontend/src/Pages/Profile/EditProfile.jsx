import React, { useState, useEffect } from "react";
import usePageTitle from "../../Components/customHooks/PageTitle";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../Redux/Slices/apiAuthSlice";
import Loader from "../../Components/Loader/Loader";
import toast from "react-hot-toast";
import { EmptyProfile } from "../../Components/Data/Data";
import { setUser } from "../Redux/Slices/protectRouteSlice";
import { useDispatch } from "react-redux";

const EditProfile = () => {
  usePageTitle("Edit Your Profile");
  const dispatch = useDispatch();
  const { data: user, isLoading: loadingUser } = useGetUserProfileQuery();
  const [updateUserProfile, { isLoading: updating }] =
    useUpdateUserProfileMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(EmptyProfile);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPreview(user.avatar || EmptyProfile);
      setAvatar(null);
    }
  }, [user]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setAvatar(null);
      setPreview(user?.avatar || EmptyProfile);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await updateUserProfile(formData).unwrap();
      let userData = {
        _id: res._id,
        name: res.name,
        email: res.email,
        role: res.role,
        avatar: res.avatar,
        token: res.token,
        createdAt: res.createdAt,
      };

      dispatch(setUser(userData));
      toast.success(res?.message || "Profile updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err.message || "Something went wrong.");
      console.error("Update error:", err);
    }
  };

  if (loadingUser) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 p-4">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 transition-all"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          Edit Profile
        </h2>

        <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Avatar Image
          </label>
          <div className="flex items-center flex-row-reverse gap-x-2">
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-[50px] h-[50px] object-cover rounded-full border border-gray-300"
              />
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            className="mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition text-lg font-semibold"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
