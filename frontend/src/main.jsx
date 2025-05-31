import "symbol-observable";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./Pages/Redux/Store/Store.js";
import { Provider } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

//mdb ui styles





createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster limit={1} />
    </Provider>
  </StrictMode>
);
