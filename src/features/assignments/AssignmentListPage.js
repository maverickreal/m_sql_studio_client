import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useSearchParams } from "react-router";
import { useGetAssignmentsQuery } from "../../store/api";
import { AssignmentCard } from "./AssignmentCard";
import { PageTransition } from "../../components/PageTransition";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Button } from "../../components/ui/Button";
export function AssignmentListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || "1");
    const { data, isLoading, isError, error } = useGetAssignmentsQuery({
        page,
        limit: 20,
    });
    return (_jsx(PageTransition, { children: _jsxs("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 py-12", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Assignments" }), _jsx("p", { className: "mt-1 text-sm text-surface-400", children: "Practice SQL with real-world scenarios" })] }) }), isLoading ? (_jsx(LoadingSpinner, {})) : isError ? (_jsx("div", { className: "mt-12 rounded-lg border border-red-800 bg-red-950/30 p-6 text-center", children: _jsx("p", { className: "text-red-400", children: error && "status" in error
                            ? `Error ${error.status}: ${"data" in error && error.data && typeof error.data === "object" && "message" in error.data ? String(error.data.message) : "Failed to load assignments"}`
                            : "Failed to load assignments" }) })) : data?.assignments && data.assignments.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "mt-8 grid gap-4 sm:grid-cols-2", children: data.assignments.map((assignment, i) => (_jsx(AssignmentCard, { assignment: assignment, index: i }, assignment._id))) }), _jsxs("div", { className: "mt-8 flex items-center justify-center gap-3", children: [_jsx(Button, { variant: "secondary", size: "sm", disabled: page <= 1, onClick: () => {
                                        const params = new URLSearchParams(searchParams);
                                        params.set("page", String(page - 1));
                                        setSearchParams(params);
                                    }, children: "Previous" }), _jsxs("span", { className: "text-sm text-surface-400", children: ["Page ", page] }), _jsx(Button, { variant: "secondary", size: "sm", disabled: data.assignments.length < 20, onClick: () => {
                                        const params = new URLSearchParams(searchParams);
                                        params.set("page", String(page + 1));
                                        setSearchParams(params);
                                    }, children: "Next" })] })] })) : (_jsx("div", { className: "mt-12 rounded-lg border border-surface-800 bg-surface-900/50 p-12 text-center", children: _jsx("p", { className: "text-surface-400", children: "No assignments available yet." }) }))] }) }));
}
export async function assignmentListLoader() {
    return null;
}
