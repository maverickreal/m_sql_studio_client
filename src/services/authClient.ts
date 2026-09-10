import { createAuthClient } from "better-auth/react";
import { apiUrl } from "../config/apiBase";

export const authClient = createAuthClient({
	baseURL: apiUrl("/api/auth"),
});
