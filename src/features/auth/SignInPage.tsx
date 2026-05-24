import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { authClient } from "../../services/authClient";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const result = signInSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        setServerError(error.message || "Sign in failed");
      } else {
        navigate("/");
        window.location.reload();
      }
    } catch {
      setServerError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-white">Sign In</h1>
        <p className="mt-1 text-sm text-surface-400">
          Welcome back to Cipher SQL Studio
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="Your password"
            autoComplete="current-password"
          />

          {serverError && (
            <p className="text-sm text-red-400">{serverError}</p>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-surface-400">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-brand-400 hover:text-brand-300"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
