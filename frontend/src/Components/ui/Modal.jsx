// components/LoginWelcomeModal.jsx
import React from "react";
import { motion } from "framer-motion";

const Modal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 pt-24">
      <motion.div
        initial={{ y: -200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -200, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full text-center border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-2 text-blue-700">👋 Welcome Back!</h2>
        <p className="text-gray-600 mb-4 text-sm">
          We’re glad to see you again. Hope you’re having a great day!
        </p>
        <button
          onClick={onClose}
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:from-blue-600 hover:to-indigo-600 transition duration-300"
        >
          Let's go 🚀
        </button>
      </motion.div>
    </div>
  );
};

export default Modal;
