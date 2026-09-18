import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import ProviderPage from "./pages/ProviderPage";
import "./style.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/providers/:provider" element={<ProviderPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);