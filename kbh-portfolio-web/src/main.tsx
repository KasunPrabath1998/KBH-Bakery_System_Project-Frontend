// 

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Import BrowserRouter
import "./index.css";
import { App } from "./App";

// Wrap the App component in BrowserRouter to provide routing context
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>  {/* Wrap your application inside BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
