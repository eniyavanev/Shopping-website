import React from "react";
import WhatsApp from "../../../src/assets/Images/whatsapp.png";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "+91 8940650248"; // Replace with the desired phone number
    const message = "Hello!"; // Replace with the desired message
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };
  return (
    <div>
      <button onClick={handleWhatsAppClick} className="fixed bottom-4 right-4 cursor-pointer">
        <img
          src={WhatsApp}
          alt="whatsapp"
        />
      </button>
    </div>
  );
};

export default WhatsAppButton;
