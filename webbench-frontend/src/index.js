import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UploadProvider } from "./contexts/UploadContext"; // 👈

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UploadProvider>
    <App />
  </UploadProvider>
);
