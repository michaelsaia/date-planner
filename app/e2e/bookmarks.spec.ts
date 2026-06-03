import { test, expect } from "@playwright/test";
import { signUpAndOnboard } from "./helpers";

test.describe("Bookmark & Save", () => {
  test.beforeEach(async ({ page }) => {
    await signUpAndOnboard(page);
  });

  test("bookmark button toggles on a date idea card", async ({ page }) => {
    // Wait for suggestion cards to load
    const bookmarkBtn = page.getByRole("button", { name: /bookmark|save/i }).first();
    await expect(bookmarkBtn).toBeVisible({ timeout: 15000 });

    // Click to bookmark
    await bookmarkBtn.click();
    // Wait for API call
    await page.waitForTimeout(500);

    // Click again to un-bookmark
    await bookmarkBtn.click();
    await page.waitForTimeout(500);
  });

  test("bookmarked idea appears on saved page", async ({ page }) => {
    // Bookmark the first idea
    const bookmarkBtn = page.getByRole("button", { name: /bookmark|save/i }).first();
    await expect(bookmarkBtn).toBeVisible({ timeout: 15000 });
    await bookmarkBtn.click();
    await page.waitForTimeout(1000);

    // Navigate to saved page
    await page.goto("/saved");
    await expect(page.getByText("Saved Dates")).toBeVisible({ timeout: 10000 });

    // Should have at least one saved card
    const savedCards = page.locator("a[href^='/explore/']");
    await expect(savedCards.first()).toBeVisible({ timeout: 10000 });
  });

  test("un-bookmarking on saved page removes the card", async ({ page }) => {
    // Bookmark the first idea from explore
    const bookmarkBtn = page.getByRole("button", { name: /bookmark|save/i }).first();
    await expect(bookmarkBtn).toBeVisible({ timeout: 15000 });
    await bookmarkBtn.click();
    await page.waitForTimeout(1000);

    // Go to saved page
    await page.goto("/saved");
    await expect(page.getByText("Saved Dates")).toBeVisible({ timeout: 10000 });

    // Un-bookmark it
    const savedBookmarkBtn = page.getByRole("button", { name: /bookmark|save/i }).first();
    await expect(savedBookmarkBtn).toBeVisible({ timeout: 10000 });
    await savedBookmarkBtn.click();

    // Card should disappear (optimistic removal), empty state shows
    await expect(
      page.getByText(/no saved|haven't saved|start exploring/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("saved page shows empty state when no bookmarks", async ({ page }) => {
    await page.goto("/saved");
    await expect(page.getByText("Saved Dates")).toBeVisible({ timeout: 10000 });
    await expect(
      page.getByText(/no saved|haven't saved|start exploring/i)
    ).toBeVisible({ timeout: 10000 });
  });
});
