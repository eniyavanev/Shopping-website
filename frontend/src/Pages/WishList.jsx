import { useSelector, useDispatch } from "react-redux";
import {
  removeFromWishlist,
  clearWishlist,
} from "../Pages/Redux/Slices/whistlelist";
import { FaHeartBroken } from "react-icons/fa";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.wishlistItems);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ❤️ Your Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center text-gray-500 mt-20">
          <FaHeartBroken className="text-6xl mb-4" />
          <p className="text-xl">No items in your wishlist.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => dispatch(clearWishlist())}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full transition duration-200"
            >
              Clear Wishlist
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden"
              >
                <img
                  src={item.image || "/images/default.jpg"}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {item.name}
                  </h2>
                  <p className="text-blue-600 font-bold text-lg mb-3">
                    ₹{item.price}
                  </p>
                  <button
                    onClick={() => dispatch(removeFromWishlist(item._id))}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
