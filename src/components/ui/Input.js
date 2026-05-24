import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
export const Input = forwardRef(({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [label && (_jsx("label", { htmlFor: inputId, className: "text-sm font-medium text-surface-300", children: label })), _jsx("input", { ref: ref, id: inputId, className: `w-full rounded-lg border border-surface-700 bg-surface-900 px-3 py-2 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors disabled:opacity-50 ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`, ...props }), error && _jsx("p", { className: "text-sm text-red-400", children: error })] }));
});
Input.displayName = "Input";
