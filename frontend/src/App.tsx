import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AppFeaturesProvider } from "./features/appFeatures/AppFeaturesProvider";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppFeaturesProvider>
      <RouterProvider router={router} />
    </AppFeaturesProvider>
  </React.StrictMode>
);