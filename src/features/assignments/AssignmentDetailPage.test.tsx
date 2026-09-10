import { configureStore } from "@reduxjs/toolkit";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	api,
	useGetAssignmentByIdQuery,
	useGetLastSqlQuery,
} from "../../store/api";
import type { AssignmentDetail } from "../../types";
import { AssignmentDetailPage } from "./AssignmentDetailPage";

vi.mock("../../store/api", async (importOriginal) => {
	const mod = await (
		importOriginal as () => Promise<typeof import("../../store/api")>
	)();
	return {
		...mod,
		useGetAssignmentByIdQuery: vi.fn(),
		useGetLastSqlQuery: vi.fn(),
	};
});

function renderDetailPage(id: string) {
	const store = configureStore({
		reducer: {
			[api.reducerPath]: api.reducer,
			auth: (state = { user: null, sessionReady: true }) => state,
			execution: (state = { phase: "idle", result: null, error: null }) =>
				state,
		},
	});

	return render(
		<Provider store={store}>
			<MemoryRouter initialEntries={[`/assignments/${id}`]}>
				<Routes>
					<Route path="/assignments/:id" element={<AssignmentDetailPage />} />
				</Routes>
			</MemoryRouter>
		</Provider>,
	);
}

function mockDetailQueries(assignment: AssignmentDetail) {
	vi.mocked(useGetAssignmentByIdQuery).mockReturnValue({
		data: { assignment },
		isLoading: false,
		isError: false,
		error: undefined,
		refetch: vi.fn(),
	} as unknown as ReturnType<typeof useGetAssignmentByIdQuery>);
	vi.mocked(useGetLastSqlQuery).mockReturnValue({
		data: undefined,
		isLoading: false,
		isError: false,
		error: undefined,
		refetch: vi.fn(),
	} as unknown as ReturnType<typeof useGetLastSqlQuery>);
}

const baseAssignment: AssignmentDetail = {
	_id: "a1",
	title: "Test Assignment",
	description: "A test assignment",
	difficulty: "easy",
	mode: "read",
	sampleInput: [],
	sampleOutput: "",
	pgSchemaReady: true,
	createdAt: "2026-01-01T00:00:00.000Z",
	updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("AssignmentDetailPage community info", () => {
	afterEach(() => {
		cleanup();
		vi.mocked(useGetAssignmentByIdQuery).mockClear();
		vi.mocked(useGetLastSqlQuery).mockClear();
	});

	it("shows community badge and contributor when origin=community", () => {
		const assignment: AssignmentDetail = {
			...baseAssignment,
			origin: "community",
			contributor: "contributorhandle",
		};
		mockDetailQueries(assignment);

		renderDetailPage("a1");

		expect(screen.getByText("Community")).toBeTruthy();
		expect(screen.getByText(/by contributorhandle/)).toBeTruthy();
	});

	it("does not show community badge when origin=first-party", () => {
		const assignment: AssignmentDetail = {
			...baseAssignment,
			origin: "first-party",
		};
		mockDetailQueries(assignment);

		renderDetailPage("a1");

		expect(screen.queryByText("Community")).toBeNull();
	});

	it("does not show community badge when origin is undefined", () => {
		mockDetailQueries(baseAssignment);

		renderDetailPage("a1");

		expect(screen.queryByText("Community")).toBeNull();
	});

	it("labels table-signature sampleInput as Schema, not Sample Input", () => {
		mockDetailQueries({
			...baseAssignment,
			sampleInput: [
				"departments(id, name)",
				"employees(id, name, dept_id, salary)",
			],
			sampleOutput: "dept_name | name",
		});

		renderDetailPage("a1");

		expect(screen.getByRole("heading", { name: "Schema" })).toBeTruthy();
		expect(screen.queryByRole("heading", { name: "Sample Input" })).toBeNull();
		expect(screen.getByText(/departments\(id, name\)/)).toBeTruthy();
	});

	it("keeps Sample Input heading for markdown table data", () => {
		mockDetailQueries({
			...baseAssignment,
			sampleInput: ["| name | total |\n| --- | --- |\n| Alice | 150 |"],
			sampleOutput: "| name |\n| --- |\n| Alice |",
		});

		renderDetailPage("a1");

		expect(screen.getByRole("heading", { name: "Sample Input" })).toBeTruthy();
		expect(screen.queryByRole("heading", { name: "Schema" })).toBeNull();
	});

	it("uses higher-contrast text on schema and expected-output panels", () => {
		mockDetailQueries({
			...baseAssignment,
			sampleInput: ["departments(id, name)"],
			sampleOutput: "| name |\n| --- |\n| Alice |",
		});

		renderDetailPage("a1");

		const schemaHeading = screen.getByRole("heading", { name: "Schema" });
		const schemaPanel = schemaHeading.nextElementSibling as HTMLElement;
		expect(schemaPanel.className).toContain("text-surface-200");
		expect(schemaPanel.className).not.toContain("text-surface-400");

		const outputHeading = screen.getByRole("heading", {
			name: "Expected Output",
		});
		const outputPanel = outputHeading.nextElementSibling as HTMLElement;
		expect(outputPanel.className).toContain("text-surface-200");
		expect(outputPanel.className).not.toContain("text-surface-400");
	});

	it("renders markdown in description and sample I/O instead of raw source", () => {
		mockDetailQueries({
			...baseAssignment,
			description: "Join **customers** with orders.\n\n```sql\nSELECT 1;\n```",
			sampleInput: ["| name | total |\n| --- | --- |\n| Alice | 150 |"],
			sampleOutput: "| name |\n| --- |\n| Alice |",
		});

		renderDetailPage("a1");

		expect(screen.queryByText(/\*\*customers\*\*/)).toBeNull();
		expect(screen.getByText("customers").tagName).toBe("STRONG");
		expect(document.querySelectorAll("table").length).toBeGreaterThan(0);
		expect(document.querySelector("pre")).toBeTruthy();
	});
});
