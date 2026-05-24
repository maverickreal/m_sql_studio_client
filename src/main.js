import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { store } from "./store";
import { router } from "./app/router";
import "./index.css";
createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(Provider, { store: store, children: _jsx(RouterProvider, { router: router }) }) }));
