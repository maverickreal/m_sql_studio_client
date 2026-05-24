import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useParams } from "react-router";
import { useGetAssignmentByIdQuery } from "../../store/api";
import { PageTransition } from "../../components/PageTransition";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Badge } from "../../components/ui/Badge";
import { SqlEditor } from "../sql-editor/SqlEditor";
import { ResultsTable } from "../sql-editor/ResultsTable";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
const difficultyVariant = { easy: "success", medium: "warning", hard: "danger" };
export function AssignmentDetailPage() {
    useAuth();
    const { id } = useParams();
    const { data, isLoading, isError } = useGetAssignmentByIdQuery(id, {
        skip: !id,
    });
    const user = useSelector((state) => state.auth.user);
    const execution = useSelector((state) => state.execution);
    const sessionReady = useSelector((state) => state.auth.sessionReady);
    if (!id) {
        return (_jsx(PageTransition, { children: _jsx("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 py-12", children: _jsx("p", { className: "text-center text-surface-400", children: "Invalid assignment ID." }) }) }));
    }
    return (_jsx(PageTransition, { children: _jsx("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 py-12", children: isLoading ? (_jsx(LoadingSpinner, {})) : isError ? (_jsx("div", { className: "rounded-lg border border-red-800 bg-red-950/30 p-6 text-center", children: _jsx("p", { className: "text-red-400", children: "Failed to load assignment." }) })) : data?.assignment ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex items-start justify-between gap-4", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: data.assignment.title }), _jsxs("div", { className: "mt-2 flex items-center gap-2", children: [_jsx(Badge, { variant: difficultyVariant[data.assignment.difficulty], children: data.assignment.difficulty }), _jsx(Badge, { variant: "default", children: data.assignment.mode === "read" ? "SELECT only" : "Read & Write" })] })] }) }), _jsx("div", { className: "mt-6 rounded-lg border border-surface-800 bg-surface-900/50 p-4", children: _jsx("p", { className: "text-sm text-surface-300 whitespace-pre-wrap", children: data.assignment.description }) }), data.assignment.sampleInput.length > 0 && (_jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "text-sm font-semibold text-surface-300", children: "Sample Input" }), _jsx("div", { className: "mt-1 rounded-lg border border-surface-800 bg-surface-950 p-3", children: _jsx("p", { className: "text-sm font-mono text-surface-400 whitespace-pre-wrap", children: data.assignment.sampleInput.join("\n") }) })] })), data.assignment.sampleOutput && (_jsxs("div", { className: "mt-4", children: [_jsx("h3", { className: "text-sm font-semibold text-surface-300", children: "Expected Output" }), _jsx("div", { className: "mt-1 rounded-lg border border-surface-800 bg-surface-950 p-3", children: _jsx("p", { className: "text-sm font-mono text-surface-400 whitespace-pre-wrap", children: data.assignment.sampleOutput }) })] })), !sessionReady ? (_jsx(LoadingSpinner, { className: "mt-8" })) : user ? (_jsxs("div", { className: "mt-8", children: [_jsx("h2", { className: "text-lg font-semibold text-white mb-4", children: "Your Solution" }), _jsx(SqlEditor, { assignment: data.assignment }), execution.phase === "done" && execution.result && (_jsx("div", { className: "mt-6", children: _jsx(ResultsTable, { result: execution.result }) })), execution.phase === "error" && execution.error && (_jsx("div", { className: "mt-6 rounded-lg border border-red-800 bg-red-950/30 p-4", children: _jsx("p", { className: "text-sm text-red-400", children: execution.error }) })), execution.phase === "done" &&
                                !execution.result?.success &&
                                "error" in (execution.result ?? {}) && (_jsx("div", { className: "mt-6 rounded-lg border border-red-800 bg-red-950/30 p-4", children: _jsx("p", { className: "text-sm text-red-400", children: execution.result.error }) }))] })) : (_jsxs("div", { className: "mt-8 rounded-lg border border-surface-800 bg-surface-900/50 p-6 text-center", children: [_jsx("p", { className: "text-surface-400 mb-3", children: "Sign in to write and execute SQL solutions." }), _jsx(Link, { to: "/signin", children: _jsx(Button, { children: "Sign In" }) })] }))] })) : (_jsx("div", { className: "rounded-lg border border-surface-800 bg-surface-900/50 p-12 text-center", children: _jsx("p", { className: "text-surface-400", children: "Assignment not found." }) })) }) }));
}
