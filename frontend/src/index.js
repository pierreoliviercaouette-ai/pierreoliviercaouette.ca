import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App";

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const rootEl = document.getElementById("root");
if (rootEl && rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else if (rootEl) {
  createRoot(rootEl).render(app);
}
