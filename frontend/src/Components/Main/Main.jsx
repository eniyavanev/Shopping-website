import React from "react";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer";
import WhatsAppButton from "../ui/WhatsAppButton";
import ScrollToTop from "../ui/ScrollToTop";

const Main = () => {
  return (
    <div>
      <Header />
      <>
        <Outlet />
      </>
      <ScrollToTop />
      <WhatsAppButton />
      <Footer />
    </div>
  );
};

export default Main;
