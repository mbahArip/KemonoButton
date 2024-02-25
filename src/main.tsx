import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./style.css";

// Create container then append to body
createRoot(
  (() => {
    const app = document.createElement("kemono");
    app.id = "kemono-container";
    document.body.appendChild(app);
    return app;
  })()
).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-center"
      containerClassName="kemono-toast"
      toastOptions={{
        success: {
          className: "bg-zinc-900 text-zinc-50",
        },
        style: {
          zIndex: 69421,
        },
      }}
    />
  </React.StrictMode>
);
