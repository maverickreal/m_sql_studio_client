import { expect, test } from "@playwright/test";

test("anonymous catalog lists assignments", async ({ page }) => {
	await page.goto("/assignments");
	await expect(page.getByRole("heading", { name: "Assignments" })).toBeVisible();
	await expect(page.locator("a[href^='/assignments/']").first()).toBeVisible();
});

test("signup opens an assignment editor", async ({ page }) => {
	const email = `pw.${Date.now()}@example.com`;
	await page.goto("/signup");
	await page.getByLabel("Name").fill("PW Learner");
	await page.getByLabel("Email").fill(email);
	await page.getByLabel("Password").fill("E2ePass_12345");
	await page.getByRole("button", { name: "Create Account" }).click();
	await expect(page.getByRole("button", { name: /PW Learner/ })).toBeVisible();
	await page.goto("/assignments");
	await page.locator("a[href^='/assignments/']").first().click();
	await expect(page.getByRole("heading", { name: "Your Solution" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Run Query" })).toBeVisible();
});

test("learner is blocked from admin", async ({ page }) => {
	const email = `pw.admin.${Date.now()}@example.com`;
	await page.goto("/signup");
	await page.getByLabel("Name").fill("PW Learner");
	await page.getByLabel("Email").fill(email);
	await page.getByLabel("Password").fill("E2ePass_12345");
	await page.getByRole("button", { name: "Create Account" }).click();
	await expect(page.getByRole("button", { name: /PW Learner/ })).toBeVisible();
	await page.goto("/admin");
	await expect(page.getByText("Admin access required")).toBeVisible();
});
