import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
export function RootLayout() {
    useAuth();
    return (_jsxs("div", { className: "flex min-h-screen flex-col", children: [_jsx(Navbar, {}), _jsx("main", { className: "flex-1", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }));
}
