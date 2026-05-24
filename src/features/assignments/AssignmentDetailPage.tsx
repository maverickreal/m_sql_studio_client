import { useParams } from "react-router";
import { useGetAssignmentByIdQuery } from "../../store/api";
import { PageTransition } from "../../components/PageTransition";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Badge } from "../../components/ui/Badge";
import { SqlEditor } from "../sql-editor/SqlEditor";
import { ResultsTable } from "../sql-editor/ResultsTable";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Link } from "react-router";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const difficultyVariant: Record<string, "success" | "warning" | "danger"> = { easy: "success", medium: "warning", hard: "danger" };

export function AssignmentDetailPage() {
  useAuth();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetAssignmentByIdQuery(id!, {
    skip: !id,
  });

  const user = useSelector((state: RootState) => state.auth.user);
  const execution = useSelector((state: RootState) => state.execution);
  const sessionReady = useSelector((state: RootState) => state.auth.sessionReady);

  if (!id) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <p className="text-center text-surface-400">Invalid assignment ID.</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <div className="rounded-lg border border-red-800 bg-red-950/30 p-6 text-center">
            <p className="text-red-400">Failed to load assignment.</p>
          </div>
        ) : data?.assignment ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {data.assignment.title}
                </h1>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={difficultyVariant[data.assignment.difficulty]}>
                    {data.assignment.difficulty}
                  </Badge>
                  <Badge variant="default">
                    {data.assignment.mode === "read" ? "SELECT only" : "Read & Write"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-surface-800 bg-surface-900/50 p-4">
              <p className="text-sm text-surface-300 whitespace-pre-wrap">
                {data.assignment.description}
              </p>
            </div>

            {data.assignment.sampleInput.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-surface-300">
                  Sample Input
                </h3>
                <div className="mt-1 rounded-lg border border-surface-800 bg-surface-950 p-3">
                  <p className="text-sm font-mono text-surface-400 whitespace-pre-wrap">
                    {data.assignment.sampleInput.join("\n")}
                  </p>
                </div>
              </div>
            )}

            {data.assignment.sampleOutput && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-surface-300">
                  Expected Output
                </h3>
                <div className="mt-1 rounded-lg border border-surface-800 bg-surface-950 p-3">
                  <p className="text-sm font-mono text-surface-400 whitespace-pre-wrap">
                    {data.assignment.sampleOutput}
                  </p>
                </div>
              </div>
            )}

            {!sessionReady ? (
              <LoadingSpinner className="mt-8" />
            ) : user ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Your Solution
                </h2>
                <SqlEditor assignment={data.assignment} />

                {execution.phase === "done" && execution.result && (
                  <div className="mt-6">
                    <ResultsTable result={execution.result} />
                  </div>
                )}

                {execution.phase === "error" && execution.error && (
                  <div className="mt-6 rounded-lg border border-red-800 bg-red-950/30 p-4">
                    <p className="text-sm text-red-400">{execution.error}</p>
                  </div>
                )}

                {execution.phase === "done" &&
                  !execution.result?.success &&
                  "error" in (execution.result ?? {}) && (
                    <div className="mt-6 rounded-lg border border-red-800 bg-red-950/30 p-4">
                      <p className="text-sm text-red-400">
                        {(execution.result as { error: string }).error}
                      </p>
                    </div>
                  )}
              </div>
            ) : (
              <div className="mt-8 rounded-lg border border-surface-800 bg-surface-900/50 p-6 text-center">
                <p className="text-surface-400 mb-3">
                  Sign in to write and execute SQL solutions.
                </p>
                <Link to="/signin">
                  <Button>Sign In</Button>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-surface-800 bg-surface-900/50 p-12 text-center">
            <p className="text-surface-400">Assignment not found.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
