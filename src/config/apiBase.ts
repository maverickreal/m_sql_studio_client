/** Same-origin in the browser when unset. Absolute URL always (better-auth + fetch). */
export function resolveApiBase(raw: string | undefined): string {
	if (raw !== undefined && String(raw).trim() !== "") {
		return String(raw).replace(/\/$/, "");
	}
	if (typeof window !== "undefined" && window.location?.origin) {
		return window.location.origin.replace(/\/$/, "");
	}
	// SSR fallback — empty string means same-origin at runtime via browser window.location
	return "";
}

export function apiBaseUrl(): string {
	return resolveApiBase(import.meta.env.VITE_API_BASE_URL);
}

export function apiUrl(path: string): string {
	const base = apiBaseUrl();
	const p = path.startsWith("/") ? path : `/${path}`;
	return `${base}${p}`;
}
