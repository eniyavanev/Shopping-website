import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchInput = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [keyword, setKeyword] = useState("");

  const searchHandler = (e) => {
    if (e) e.preventDefault();

    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchHandler(); // e is optional
    }
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setKeyword("");
    }
  }, [location]);

  return (
    <div className="relative w-full md:w-64">
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-700"
      />
      <button
        onClick={searchHandler}
        className="absolute right-2 top-1/2 cursor-pointer transform -translate-y-1/2 text-blue-700 hover:text-blue-800"
      >
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchInput;
