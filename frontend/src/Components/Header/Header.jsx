import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutUserMutation } from "../../Pages/Redux/Slices/apiAuthSlice";
import { removeUser } from "../../Pages/Redux/Slices/protectRouteSlice";
import toast from "react-hot-toast";
import SearchInput from "../Search/Search";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  FaHeart,
  FaSignOutAlt,
  FaUserCog,
  FaTachometerAlt,
} from "react-icons/fa";
import { clearLoginModalSeen } from "../../Utils/modalHelper";

const Header = () => {
  const user = useSelector((state) => state.protectRoute.user);
  const { items } = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [logoutUser] = useLogoutUserMutation();

  // ✅ Track online/offline status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // ✅ Online/offline status listeners
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await logoutUser().unwrap();
      dispatch(removeUser());
      clearLoginModalSeen();
      toast.success(res?.message || "Logout successful!");
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = (route) => {
    setDropdownOpen(false);
    navigate(`/ProtectedRoutes/${route}`);
  };

  const handleWishlistClick = () => {
    setDropdownOpen(false);
    navigate("/Wishlist");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="text-blue-700 text-2xl font-bold">
          🛒 Eniyavan Cart
        </Link>

        {user && <SearchInput />}

        <div className="flex items-center gap-3 relative">
          {!user && (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
            >
              <ShoppingCart size={18} />
              Login
            </Link>
          )}

          <Link
            to="/cart"
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            <ShoppingCart size={18} />
            Cart
            <span className="ml-1 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {items?.length}
            </span>
          </Link>

          {user && (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {/* Profile photo with online indicator */}
                <div className="relative w-10 h-10">
                  <img
                    src={
                      user.avatar ||
                      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    alt="Profile"
                    className="w-full h-full rounded-full border object-cover"
                  />
                  {isOnline && (
                    <>
                      {/* Dot */}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 ${
                          isOnline ? "bg-green-500" : "bg-gray-400"
                        } border-2 border-white rounded-full z-10`}
                      />
                      {/* Ring */}
                      <span className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-70 pointer-events-none" />
                    </>
                  )}
                </div>
                <span className="font-semibold">{user.name || "User"}</span>
                {dropdownOpen ? (
                  <IoIosArrowUp size={20} />
                ) : (
                  <IoIosArrowDown size={20} />
                )}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 py-2">
                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        navigate("/ProtectedRoutes/Admin/Dashboard");
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <FaTachometerAlt /> Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => handleProfileClick("profile")}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <FaUserCog /> Profile
                  </button>

                  <button
                    onClick={handleWishlistClick}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <FaHeart /> Wishlist
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
