import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/Images/Animation - 1747740332241.json"; // your downloaded JSON

const Loader = ({ height = 300, width = 300 }) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Lottie animationData={loadingAnimation} loop style={{ height, width }} />
    </div>
  );
};

export default Loader;
