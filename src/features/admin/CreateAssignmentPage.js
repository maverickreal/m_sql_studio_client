import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { PageTransition } from "../../components/PageTransition";
import { useCreateAssignmentMutation } from "../../store/api";
import { z } from "zod";
const createAssignmentSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().min(1, "Description is required").max(5000),
    difficulty: z.enum(["easy", "medium", "hard"]),
    mode: z.enum(["read", "write"]),
    sampleInput: z.string().min(1, "Sample input is required"),
    sampleOutput: z.string().min(1, "Sample output is required"),
    solutionSql: z.string().optional(),
    validationSql: z.string().optional(),
    initSql: z.string().min(1, "Init SQL is required"),
    orderMatters: z.boolean(),
});
export function CreateAssignmentPage() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const sessionReady = useSelector((state) => state.auth.sessionReady);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [mode, setMode] = useState("read");
    const [sampleInput, setSampleInput] = useState("");
    const [sampleOutput, setSampleOutput] = useState("");
    const [solutionSql, setSolutionSql] = useState("");
    const [validationSql, setValidationSql] = useState("");
    const [initSql, setInitSql] = useState("");
    const [orderMatters, setOrderMatters] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [createAssignment, { isLoading }] = useCreateAssignmentMutation();
    if (sessionReady && (!user || user.role !== "admin")) {
        return (_jsx(PageTransition, { children: _jsx("div", { className: "mx-auto max-w-2xl px-4 sm:px-6 py-12", children: _jsx("div", { className: "rounded-lg border border-amber-800 bg-amber-950/30 p-6 text-center", children: _jsx("p", { className: "text-amber-400", children: "Admin access required to create assignments." }) }) }) }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setServerError("");
        const result = createAssignmentSchema.safeParse({
            title,
            description,
            difficulty,
            mode,
            sampleInput,
            sampleOutput,
            solutionSql: solutionSql || undefined,
            validationSql: validationSql || undefined,
            initSql,
            orderMatters,
        });
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
        try {
            const payload = {
                ...result.data,
                sampleInput: result.data.sampleInput.split("\n").filter(Boolean),
            };
            await createAssignment(payload).unwrap();
            navigate("/assignments");
        }
        catch (err) {
            const message = err && typeof err === "object" && "data" in err
                ? String(err.data || "Failed to create assignment")
                : "Failed to create assignment";
            setServerError(message);
        }
    };
    return (_jsx(PageTransition, { children: _jsxs("div", { className: "mx-auto max-w-2xl px-4 sm:px-6 py-12", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Create Assignment" }), _jsx("p", { className: "mt-1 text-sm text-surface-400", children: "Add a new SQL assignment for students" }), _jsxs("form", { onSubmit: handleSubmit, className: "mt-8 space-y-5", children: [_jsx(Input, { label: "Title", value: title, onChange: (e) => setTitle(e.target.value), error: errors.title, placeholder: "e.g. Find all users" }), _jsx(Textarea, { label: "Description", value: description, onChange: (e) => setDescription(e.target.value), error: errors.description, placeholder: "Describe what the student needs to do...", rows: 4 }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-sm font-medium text-surface-300", children: "Difficulty" }), _jsxs("select", { value: difficulty, onChange: (e) => setDifficulty(e.target.value), className: "rounded-lg border border-surface-700 bg-surface-900 px-3 py-2 text-sm text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500", children: [_jsx("option", { value: "easy", children: "Easy" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "hard", children: "Hard" })] })] }), _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { className: "text-sm font-medium text-surface-300", children: "Mode" }), _jsxs("select", { value: mode, onChange: (e) => setMode(e.target.value), className: "rounded-lg border border-surface-700 bg-surface-900 px-3 py-2 text-sm text-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500", children: [_jsx("option", { value: "read", children: "Read (SELECT only)" }), _jsx("option", { value: "write", children: "Write (INSERT/UPDATE/DELETE)" })] })] })] }), _jsx(Textarea, { label: "Sample Input", value: sampleInput, onChange: (e) => setSampleInput(e.target.value), error: errors.sampleInput, placeholder: "One per line", rows: 3 }), _jsx(Input, { label: "Sample Output", value: sampleOutput, onChange: (e) => setSampleOutput(e.target.value), error: errors.sampleOutput, placeholder: 'e.g. {"id": 1, "name": "Alice"}' }), _jsx(Textarea, { label: "Solution SQL (optional)", value: solutionSql, onChange: (e) => setSolutionSql(e.target.value), error: errors.solutionSql, placeholder: "The reference solution query", rows: 3 }), _jsx(Textarea, { label: "Validation SQL (optional)", value: validationSql, onChange: (e) => setValidationSql(e.target.value), error: errors.validationSql, placeholder: "SQL to validate the user's output against", rows: 3 }), _jsx(Textarea, { label: "Init SQL", value: initSql, onChange: (e) => setInitSql(e.target.value), error: errors.initSql, placeholder: "CREATE TABLE ... INSERT INTO ...", rows: 6 }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: orderMatters, onChange: (e) => setOrderMatters(e.target.checked), className: "rounded border-surface-700 bg-surface-900 text-brand-500 focus:ring-brand-500" }), _jsx("span", { className: "text-sm text-surface-300", children: "Order matters" })] }), serverError && (_jsx("div", { className: "rounded-lg border border-red-800 bg-red-950/30 p-3", children: _jsx("p", { className: "text-sm text-red-400", children: serverError }) })), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { type: "submit", loading: isLoading, children: "Create Assignment" }), _jsx(Button, { type: "button", variant: "ghost", onClick: () => navigate("/assignments"), children: "Cancel" })] })] })] }) }));
}
export async function createAssignmentLoader() {
    return null;
}
