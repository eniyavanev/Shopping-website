import React, { useEffect, useState } from "react";
import UpArrow from "../../../src/assets/Images/up-arrow.png";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide based on scroll position
  const handleScroll = () => {
    setIsVisible(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-16 z-50 cursor-pointer shadow-md"
        >
          <img
            src={UpArrow}
            alt="Go to top"
            className="w-8 h-8 hover:scale-110 transition-transform duration-300"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
