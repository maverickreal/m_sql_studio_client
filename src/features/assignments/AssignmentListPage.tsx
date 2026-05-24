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

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Assignments</h1>
            <p className="mt-1 text-sm text-surface-400">
              Practice SQL with real-world scenarios
            </p>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <div className="mt-12 rounded-lg border border-red-800 bg-red-950/30 p-6 text-center">
            <p className="text-red-400">
              {error && "status" in error
                ? `Error ${error.status}: ${"data" in error && error.data && typeof error.data === "object" && "message" in error.data ? String((error.data as Record<string, unknown>).message) : "Failed to load assignments"}`
                : "Failed to load assignments"}
            </p>
          </div>
        ) : data?.assignments && data.assignments.length > 0 ? (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {data.assignments.map((assignment, i) => (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  index={i}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", String(page - 1));
                  setSearchParams(params);
                }}
              >
                Previous
              </Button>
              <span className="text-sm text-surface-400">Page {page}</span>
              <Button
                variant="secondary"
                size="sm"
                disabled={data.assignments.length < 20}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", String(page + 1));
                  setSearchParams(params);
                }}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-12 rounded-lg border border-surface-800 bg-surface-900/50 p-12 text-center">
            <p className="text-surface-400">No assignments available yet.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export async function assignmentListLoader() {
  return null;
}
