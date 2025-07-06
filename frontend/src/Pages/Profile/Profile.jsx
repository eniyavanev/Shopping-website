import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import usePageTitle from "../../Components/customHooks/PageTitle";

const Profile = () => {
  usePageTitle("Profile");
  // Dummy data – replace with actual user info from Redux or props
  const user = useSelector((state) => state.protectRoute.user);

  const userDetails = [
    {
      label: "Full Name",
      value: user.name,
    },
    {
      label: "Email",
      value: user.email,
    },
    {
      label: "Joined",
      value: String(user.createdAt).substring(0, 10),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">My Profile</h2>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section */}
        <div className="flex flex-col items-center">
          <img
            src={
              user.avatar.image ||
              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            }
            alt="Profile"
            className="w-40 h-40 rounded-full border border-gray-300 shadow"
          />
          <Link
            to="/ProtectedRoutes/EditProfile"
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
          >
            ✏️ Edit Profile
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex-1 space-y-4">
          {userDetails.map((detail, index) => (
            <div key={index}>
              <label className="block text-gray-600 font-bold">
                {detail.label}
              </label>
              <p className="text-gray-800">{detail.value}</p>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/ProtectedRoutes/UserOrders" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition w-full sm:w-auto">
              📦 My Orders
            </Link>
            <Link
              to="/ProtectedRoutes/UpdatePassword"
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition w-full sm:w-auto"
            >
              🔐 Change Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
