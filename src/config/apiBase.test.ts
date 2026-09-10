import { describe, expect, it } from "vitest";
import { resolveApiBase } from "./apiBase";

describe("resolveApiBase", () => {
	it("strips a trailing slash on an explicit base", () => {
		expect(resolveApiBase("http://127.0.0.1:8000/")).toBe(
			"http://127.0.0.1:8000",
		);
	});

	it("falls back to an absolute URL when unset", () => {
		const base = resolveApiBase("");
		expect(base.startsWith("http")).toBe(true);
	});
});
