import { test, expect } from "@playwright/test";
import { uniqueEmail } from "./helpers";

/**
 * Full critical path test: sign up → onboard → browse → view detail → bookmark → view saved
 * This tests the complete happy-path user journey in a single flow.
 */
test("critical path: signup → onboard → browse → bookmark → saved", async ({ page }) => {
  const email = uniqueEmail();
  const password = "TestPass123!";

  // 1. Sign up
  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();
  await page.waitForURL("**/onboarding", { timeout: 15000 });

  // 2. Onboard — interests
  await expect(page.getByText("What do you enjoy?")).toBeVisible({ timeout: 15000 });
  const interestPills = page.locator(".flex.flex-wrap button");
  await interestPills.first().click();
  await interestPills.nth(1).click();
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Next" }).click();

  // Budget — accept defaults
  await expect(page.getByRole("heading", { name: /budget/i })).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Next" }).click();

  // Location — skip, finish
  await expect(page.getByRole("heading", { name: /where are you based/i })).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Finish" }).click();

  // 3. Browse explore page
  await page.waitForURL("**/explore", { timeout: 15000 });
  await expect(page.getByText("Explore Date Ideas")).toBeVisible();

  // Wait for suggestions to load
  const cardLink = page.locator("a[href^='/explore/']").first();
  await expect(cardLink).toBeVisible({ timeout: 15000 });

  // 4. Bookmark the first idea
  const bookmarkBtn = page.getByRole("button", { name: /bookmark|save/i }).first();
  await bookmarkBtn.click();
  await page.waitForTimeout(1000);

  // 5. Click into detail page
  await cardLink.click();
  await page.waitForURL("**/explore/*", { timeout: 15000 });
  // Verify detail content loads
  await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

  // 6. Navigate to saved page
  await page.goto("/saved");
  await expect(page.getByText("Saved Dates")).toBeVisible({ timeout: 10000 });

  // 7. Verify bookmarked idea is shown
  const savedCards = page.locator("a[href^='/explore/']");
  await expect(savedCards.first()).toBeVisible({ timeout: 10000 });
  const savedCount = await savedCards.count();
  expect(savedCount).toBeGreaterThanOrEqual(1);
});

test("unauthenticated users are redirected to login for protected pages", async ({ page }) => {
  await page.goto("/explore");
  await page.waitForURL("**/login**", { timeout: 15000 });

  await page.goto("/saved");
  await page.waitForURL("**/login**", { timeout: 15000 });

  await page.goto("/profile");
  await page.waitForURL("**/login**", { timeout: 15000 });
});

test("404 page is shown for unknown routes", async ({ page }) => {
  await page.goto("/nonexistent-page");
  await expect(
    page.getByText(/not found|404|page doesn't exist/i)
  ).toBeVisible({ timeout: 10000 });
});
