import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "sonner";
import "./app.css";

import { ThemeProvider } from "@components/ThemeProvider";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Register from "@pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="ai-simulator-theme">
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        expand={false}
        richColors
        closeButton
        theme="system"
      />
    </ThemeProvider>
  </React.StrictMode>
);
