import { test, expect } from "@playwright/test";

test("Dashboard loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Finance Freedom/);
    // Check for a main dashboard element
    await expect(page.getByText("Visão Geral")).toBeVisible();
});
