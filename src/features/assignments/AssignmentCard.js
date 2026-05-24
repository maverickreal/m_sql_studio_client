import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Badge } from "../../components/ui/Badge";
import { Link } from "react-router";
import { motion } from "motion/react";
const difficultyVariant = { easy: "success", medium: "warning", hard: "danger" };
export function AssignmentCard({ assignment, index }) {
    return (_jsx(motion.div, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.05 }, children: _jsxs(Link, { to: `/assignments/${assignment._id}`, className: "block rounded-xl border border-surface-800 bg-surface-900/50 p-5 hover:border-surface-700 hover:bg-surface-900 transition-all group", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsx("h3", { className: "text-sm font-semibold text-white group-hover:text-brand-400 transition-colors", children: assignment.title }), _jsx(Badge, { variant: difficultyVariant[assignment.difficulty], children: assignment.difficulty })] }), assignment.description && (_jsx("p", { className: "mt-2 text-sm text-surface-400 line-clamp-2", children: assignment.description })), _jsxs("div", { className: "mt-3 flex items-center justify-between", children: [_jsx(Badge, { variant: "default", children: assignment.mode === "read" ? "SELECT only" : "Read & Write" }), _jsx("span", { className: "text-xs text-surface-500", children: "Solve \u2192" })] })] }) }));
}
