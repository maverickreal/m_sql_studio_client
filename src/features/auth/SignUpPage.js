import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { authClient } from "../../services/authClient";
import { z } from "zod";
const signUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Must be at least 8 characters"),
});
export function SignUpPage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setServerError("");
        const result = signUpSchema.safeParse({ name, email, password });
        if (!result.success) {
            const fieldErrors = {};
            result.error.errors.forEach((err) => {
                fieldErrors[err.path[0]] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }
        setLoading(true);
        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
            });
            if (error) {
                setServerError(error.message || "Sign up failed");
            }
            else {
                navigate("/");
                window.location.reload();
            }
        }
        catch {
            setServerError("An unexpected error occurred");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "flex min-h-[80vh] items-center justify-center px-4", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "w-full max-w-sm", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Create Account" }), _jsx("p", { className: "mt-1 text-sm text-surface-400", children: "Start your SQL learning journey" }), _jsxs("form", { onSubmit: handleSubmit, className: "mt-8 space-y-4", children: [_jsx(Input, { label: "Name", type: "text", value: name, onChange: (e) => setName(e.target.value), error: errors.name, placeholder: "Your name", autoComplete: "name" }), _jsx(Input, { label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), error: errors.email, placeholder: "you@example.com", autoComplete: "email" }), _jsx(Input, { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), error: errors.password, placeholder: "At least 8 characters", autoComplete: "new-password" }), serverError && (_jsx("p", { className: "text-sm text-red-400", children: serverError })), _jsx(Button, { type: "submit", loading: loading, className: "w-full", children: "Create Account" })] }), _jsxs("p", { className: "mt-6 text-center text-sm text-surface-400", children: ["Already have an account?", " ", _jsx(Link, { to: "/signin", className: "font-medium text-brand-400 hover:text-brand-300", children: "Sign in" })] })] }) }));
}
