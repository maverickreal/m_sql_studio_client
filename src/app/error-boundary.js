import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRouteError, isRouteErrorResponse, Link } from "react-router";
import { Button } from "../components/ui/Button";
export function ErrorBoundary() {
    const error = useRouteError();
    let title = "Something went wrong";
    let message = "An unexpected error occurred.";
    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            title = "Page not found";
            message = "The page you're looking for doesn't exist.";
        }
        else if (error.status === 401) {
            title = "Authentication required";
            message = "Please sign in to access this page.";
        }
        else if (error.status === 403) {
            title = "Access denied";
            message = "You don't have permission to access this page.";
        }
    }
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center px-4", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-4xl font-bold text-white", children: title }), _jsx("p", { className: "mt-3 text-surface-400", children: message }), _jsxs("div", { className: "mt-6 flex items-center justify-center gap-3", children: [_jsx(Link, { to: "/", children: _jsx(Button, { children: "Go Home" }) }), _jsx(Link, { to: "/signin", children: _jsx(Button, { variant: "secondary", children: "Sign In" }) })] })] }) }));
}
