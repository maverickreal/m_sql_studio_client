import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { MarkdownContent } from "../../components/MarkdownContent";
import { PageTransition } from "../../components/PageTransition";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import type { RootState } from "../../store";
import { useGetAssignmentByIdQuery, useGetLastSqlQuery } from "../../store/api";
import type { AssignmentDetail } from "../../types";
import { ResultsTable } from "../sql-editor/ResultsTable";
import { SqlEditor } from "../sql-editor/SqlEditor";

const difficultyVariant: Record<string, "success" | "warning" | "danger"> = {
	easy: "success",
	medium: "warning",
	hard: "danger",
};

function CommunityInfo({ assignment }: { assignment: AssignmentDetail }) {
	if (assignment.origin !== "community") return null;
	return (
		<div className="mt-3 flex items-center gap-3">
			<Badge variant="success">Community</Badge>
			{assignment.contributor && (
				<span className="text-sm text-surface-400">
					by {assignment.contributor}
				</span>
			)}
		</div>
	);
}

/** Problem YAML `sampleInput` is table sketches: `table(col, col)`. Seed data is markdown rows. */
function isSchemaSketch(lines: string[]): boolean {
	if (lines.length === 0) return false;
	const sketch = /^[A-Za-z_][\w.]*\s*\([^)]+\)$/;
	return lines.every((line) => sketch.test(line.trim()));
}

function SampleIoPanel({ title, body }: { title: string; body: string }) {
	return (
		<div className="mt-4">
			<h3 className="font-semibold text-sm text-surface-300">{title}</h3>
			<div className="mt-1 rounded-lg border border-surface-800 bg-surface-950 p-3 text-surface-200">
				<MarkdownContent className="font-mono text-sm">{body}</MarkdownContent>
			</div>
		</div>
	);
}

export function AssignmentDetailPage() {
	useAuth();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isError } = useGetAssignmentByIdQuery(id ?? "", {
		skip: !id,
	});

	const user = useSelector((state: RootState) => state.auth.user);

	const { data: lastSql } = useGetLastSqlQuery(id ?? "", {
		skip: !id || !user,
	});
	const execution = useSelector((state: RootState) => state.execution);
	const sessionReady = useSelector(
		(state: RootState) => state.auth.sessionReady,
	);

	if (!id) {
		return (
			<PageTransition>
				<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
					<p className="text-center text-surface-400">Invalid assignment ID.</p>
				</div>
			</PageTransition>
		);
	}

	return (
		<PageTransition>
			<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
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
								<h1 className="font-bold text-2xl text-fg">
									{data.assignment.title}
								</h1>
								<div className="mt-2 flex items-center gap-2">
									<Badge
										variant={difficultyVariant[data.assignment.difficulty]}
									>
										{data.assignment.difficulty}
									</Badge>
									<Badge variant="default">
										{data.assignment.mode === "read"
											? "SELECT only"
											: "Read & Write"}
									</Badge>
								</div>
								<CommunityInfo assignment={data.assignment} />
							</div>
						</div>

						<div className="mt-6 rounded-lg border border-surface-800 bg-surface-900/50 p-4">
							<MarkdownContent className="text-sm text-surface-300">
								{data.assignment.description}
							</MarkdownContent>
						</div>

						{data.assignment.sampleInput.length > 0 && (
							<SampleIoPanel
								title={
									isSchemaSketch(data.assignment.sampleInput)
										? "Schema"
										: "Sample Input"
								}
								body={data.assignment.sampleInput.join("\n")}
							/>
						)}

						{data.assignment.sampleOutput && (
							<SampleIoPanel
								title="Expected Output"
								body={data.assignment.sampleOutput}
							/>
						)}

						{!sessionReady ? (
							<LoadingSpinner className="mt-8" />
						) : user ? (
							<div className="mt-8">
								<h2 className="mb-4 font-semibold text-fg text-lg">
									Your Solution
								</h2>
								<SqlEditor
									key={data.assignment._id}
									assignment={data.assignment}
									initialSql={lastSql?.userSql ?? null}
								/>

								{execution.phase === "done" && execution.result && (
									<div className="mt-6">
										<ResultsTable result={execution.result} />
									</div>
								)}

								{execution.phase === "error" && execution.error && (
									<div className="mt-6 rounded-lg border border-red-800 bg-red-950/30 p-4">
										<p className="text-red-400 text-sm">{execution.error}</p>
									</div>
								)}
							</div>
						) : (
							<div className="mt-8 rounded-lg border border-surface-800 bg-surface-900/50 p-6 text-center">
								<p className="mb-3 text-surface-400">
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
