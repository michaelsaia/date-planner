import { test, expect } from "@playwright/test";
import { signUpAndOnboard } from "./helpers";

test.describe("Explore & Browse", () => {
  test.beforeEach(async ({ page }) => {
    await signUpAndOnboard(page);
  });

  test("explore page loads suggestion cards", async ({ page }) => {
    await expect(page.getByText("Explore Date Ideas")).toBeVisible();
    // Wait for suggestions to load (cards with links to detail pages)
    const cards = page.locator("a[href^='/explore/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test("mood filter buttons are visible and toggleable", async ({ page }) => {
    // MoodFilter renders as a fieldset with toggle buttons
    const moodFilter = page.getByRole("group", { name: "Mood", exact: true });
    await expect(moodFilter).toBeVisible({ timeout: 15000 });

    // Click a mood filter
    const romanticBtn = moodFilter.getByRole("button", { name: /romantic/i });
    if (await romanticBtn.isVisible()) {
      await romanticBtn.click();
      await expect(romanticBtn).toHaveAttribute("aria-pressed", "true");
      // Click again to deselect
      await romanticBtn.click();
      await expect(romanticBtn).toHaveAttribute("aria-pressed", "false");
    }
  });

  test("budget filter buttons are visible", async ({ page }) => {
    const budgetFilter = page.getByRole("group", { name: "Budget", exact: true });
    await expect(budgetFilter).toBeVisible({ timeout: 15000 });
  });

  test("clicking a date idea card navigates to detail page", async ({ page }) => {
    const cardLink = page.locator("a[href^='/explore/']").first();
    await expect(cardLink).toBeVisible({ timeout: 15000 });
    await cardLink.click();

    await page.waitForURL("**/explore/*", { timeout: 15000 });
    // Detail page has a heading
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
  });

  test("refresh button reloads suggestions", async ({ page }) => {
    const refreshBtn = page.getByRole("button", { name: /refresh/i });
    await expect(refreshBtn).toBeVisible({ timeout: 15000 });
    await refreshBtn.click();
    // Cards should reappear after refresh
    await expect(
      page.locator("a[href^='/explore/']").first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("unauthenticated user is redirected to login from /explore", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/explore");
    await page.waitForURL("**/login**", { timeout: 15000 });
  });
});
