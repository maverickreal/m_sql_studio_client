import { describe, expect, it, vi } from "vitest";
import { resolveApiBase } from "./apiBase";

describe("resolveApiBase", () => {
	it("strips a trailing slash on an explicit base", () => {
		expect(resolveApiBase("http://127.0.0.1:8000/")).toBe(
			"http://127.0.0.1:8000",
		);
	});

	it("returns empty string when unset (SSR fallback - same-origin at runtime)", () => {
		vi.stubGlobal("window", undefined);
		expect(resolveApiBase("")).toBe("");
		vi.unstubAllGlobals();
	});
});
