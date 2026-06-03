import { test, expect } from "@playwright/test";
import { signUp } from "./helpers";

test.describe("Onboarding Flow", () => {
  test("full onboarding: interests → budget → location → explore", async ({ page }) => {
    await signUp(page);

    // Step 1: Interests
    await expect(page.getByText("What do you enjoy?")).toBeVisible({ timeout: 15000 });
    // Back button should be invisible on first step
    const backBtn = page.getByRole("button", { name: "Back" });
    await expect(backBtn).not.toBeVisible();

    // Try to advance without selecting any interest
    await page.getByRole("button", { name: "Next" }).click();
    // Validation message should appear
    await expect(page.getByText(/select at least/i)).toBeVisible();

    // Select some interests (buttons inside the interest categories, not nav)
    const interestPills = page.locator(".flex.flex-wrap button");
    await interestPills.first().click();
    await interestPills.nth(1).click();
    await page.getByRole("button", { name: "Next" }).click();

    // Step 2: Budget
    await expect(page.getByRole("heading", { name: /budget/i })).toBeVisible({ timeout: 10000 });
    await expect(backBtn).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();

    // Step 3: Location
    await expect(page.getByRole("heading", { name: /where are you based/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "Finish" }).click();

    // Should redirect to explore
    await page.waitForURL("**/explore", { timeout: 15000 });
    await expect(page.getByText("Explore Date Ideas")).toBeVisible();
  });

  test("onboarding back button navigates to previous step", async ({ page }) => {
    await signUp(page);

    // Step 1: Select an interest and go next
    await expect(page.getByText("What do you enjoy?")).toBeVisible({ timeout: 15000 });
    const interestPills = page.locator(".flex.flex-wrap button");
    await interestPills.first().click();
    // Wait for re-render to settle
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Next" }).click();

    // Step 2: Budget — go back
    await expect(page.getByRole("heading", { name: /budget/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "Back" }).click();

    // Should be back on interests step
    await expect(page.getByText("What do you enjoy?")).toBeVisible();
  });

  test("progress bar advances with each step", async ({ page }) => {
    await signUp(page);
    await expect(page.getByText("What do you enjoy?")).toBeVisible({ timeout: 15000 });

    // There should be 3 progress segments
    const progressBars = page.locator(".rounded-full.h-1\\.5");
    await expect(progressBars).toHaveCount(3);
  });
});
