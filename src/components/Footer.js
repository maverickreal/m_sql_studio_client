import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { APP_NAME } from "../utils/constants";
export function Footer() {
    return (_jsx("footer", { className: "border-t border-surface-800 mt-auto", children: _jsx("div", { className: "mx-auto max-w-6xl px-4 sm:px-6 py-6", children: _jsxs("p", { className: "text-sm text-surface-500 text-center", children: ["\u00A9 ", new Date().getFullYear(), " ", APP_NAME, ". Built for learning SQL."] }) }) }));
}
