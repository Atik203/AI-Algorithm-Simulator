import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import "./app.css";

import { persistor, store } from "@/store";
import { ThemeProvider } from "@components/ThemeProvider";
import { Layout } from "@components/Layout";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Register from "@pages/Register";
import Simulator from "@pages/Simulator";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/register",
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
  {
    path: "/simulator",
    element: (
      <Layout showFooter={false}>
        <Simulator />
      </Layout>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
