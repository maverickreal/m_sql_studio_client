import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const variantClasses = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500",
    secondary: "bg-surface-800 text-surface-100 hover:bg-surface-700 focus-visible:ring-surface-500 border border-surface-600",
    ghost: "text-surface-300 hover:text-surface-100 hover:bg-surface-800 focus-visible:ring-surface-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};
const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
};
export function Button({ variant = "primary", size = "md", loading, disabled, className = "", children, ...props }) {
    return (_jsxs("button", { disabled: disabled || loading, className: `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`, ...props, children: [loading && _jsx(Spinner, {}), children] }));
}
function Spinner() {
    return (_jsxs("svg", { className: "animate-spin h-4 w-4", viewBox: "0 0 24 24", fill: "none", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })] }));
}
