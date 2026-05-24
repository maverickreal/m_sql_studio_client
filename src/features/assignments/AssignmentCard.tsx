import type { Assignment } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Link } from "react-router";
import { motion } from "motion/react";

const difficultyVariant = { easy: "success", medium: "warning", hard: "danger" } as const;

export function AssignmentCard({ assignment, index }: { assignment: Assignment; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/assignments/${assignment._id}`}
        className="block rounded-xl border border-surface-800 bg-surface-900/50 p-5 hover:border-surface-700 hover:bg-surface-900 transition-all group"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-white group-hover:text-brand-400 transition-colors">
            {assignment.title}
          </h3>
          <Badge
            variant={difficultyVariant[assignment.difficulty]}
          >
            {assignment.difficulty}
          </Badge>
        </div>
        {assignment.description && (
          <p className="mt-2 text-sm text-surface-400 line-clamp-2">
            {assignment.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="default">
            {assignment.mode === "read" ? "SELECT only" : "Read & Write"}
          </Badge>
          <span className="text-xs text-surface-500">
            Solve &rarr;
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
