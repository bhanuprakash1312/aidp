import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./App.css"; // ✅ local Tailwind build
import { dotSpinner } from "ldrs";   // ✅ IMPORT

dotSpinner.register(); 
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
