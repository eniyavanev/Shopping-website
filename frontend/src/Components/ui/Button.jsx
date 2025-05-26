import React from "react";

const Button = ({ children, onClick, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-5 py-2 rounded-xl font-semibold shadow-md transition duration-300 ease-in-out 
        bg-gradient-to-r from-pink-500 to-purple-600 text-white 
        hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
