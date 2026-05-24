import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "motion/react";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
export function ResultsTable({ result }) {
    if (!result.success) {
        return (_jsxs(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, className: "rounded-lg border border-red-800 bg-red-950/30 p-4", children: [_jsx("h3", { className: "text-sm font-semibold text-red-400", children: "Error" }), _jsx("p", { className: "mt-1 text-sm font-mono text-red-300", children: result.error })] }));
    }
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Badge, { variant: "success", children: "Success" }), _jsxs("span", { className: "text-xs text-surface-400", children: [result.rowCount, " row", result.rowCount !== 1 ? "s" : "", " in", " ", result.executionTimeMs, "ms"] })] }), _jsx(Table, { columns: result.columns, rows: result.rows })] }));
}
