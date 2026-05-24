interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantClasses = {
  default: "bg-surface-800 text-surface-300 border-surface-700",
  success: "bg-emerald-900/50 text-emerald-400 border-emerald-800",
  warning: "bg-amber-900/50 text-amber-400 border-amber-800",
  danger: "bg-red-900/50 text-red-400 border-red-800",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
