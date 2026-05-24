import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "./ui/Button";
import { APP_NAME } from "../utils/constants";
import { authClient } from "../services/authClient";
export function Navbar() {
    const user = useSelector((state) => state.auth.user);
    const sessionReady = useSelector((state) => state.auth.sessionReady);
    const location = useLocation();
    const navigate = useNavigate();
    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.reload();
    };
    const isActive = (path) => location.pathname === path;
    return (_jsx("nav", { className: "sticky top-0 z-50 border-b border-surface-800 bg-surface-950/80 backdrop-blur-lg", children: _jsxs("div", { className: "mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6", children: [_jsxs("div", { className: "flex items-center gap-8", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2 text-lg font-bold text-brand-400 hover:text-brand-300 transition-colors", children: [_jsxs("svg", { className: "h-6 w-6", viewBox: "0 0 32 32", fill: "none", children: [_jsx("rect", { width: "32", height: "32", rx: "6", fill: "currentColor" }), _jsx("text", { x: "50%", y: "54%", dominantBaseline: "middle", textAnchor: "middle", fill: "#fff", fontFamily: "monospace", fontSize: "14", fontWeight: "bold", children: "SQL" })] }), APP_NAME] }), _jsx("div", { className: "hidden sm:flex items-center gap-1", children: _jsx(Link, { to: "/assignments", className: `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isActive("/assignments") ? "bg-surface-800 text-white" : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/50"}`, children: "Assignments" }) })] }), _jsx("div", { className: "flex items-center gap-3", children: !sessionReady ? (_jsx("div", { className: "h-8 w-20 animate-pulse rounded-lg bg-surface-800" })) : user ? (_jsxs("div", { className: "flex items-center gap-2", children: [user.role === "admin" && (_jsx(Link, { to: "/admin/assignments/new", className: `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${isActive("/admin/assignments/new") ? "bg-surface-800 text-white" : "text-amber-400 hover:text-amber-300"}`, children: "Admin" })), _jsx("span", { className: "hidden sm:block text-sm text-surface-400", children: user.email }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleSignOut, children: "Sign Out" })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate("/signin"), children: "Sign In" }), _jsx(Button, { size: "sm", onClick: () => navigate("/signup"), children: "Get Started" })] })) })] }) }));
}
