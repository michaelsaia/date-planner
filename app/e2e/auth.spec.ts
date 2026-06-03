import { test, expect } from "@playwright/test";
import { uniqueEmail, signUp, logIn } from "./helpers";

test.describe("Authentication", () => {
  test("homepage shows Get Started and Sign In for unauthenticated users", async ({ page }) => {
    await page.goto("/");
    // Use main content area to avoid duplicate links from nav
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: "Get Started" })).toBeVisible();
    await expect(main.getByRole("link", { name: "Sign In" })).toBeVisible();
  });

  test("sign up with valid credentials redirects to onboarding", async ({ page }) => {
    const email = uniqueEmail();
    await page.goto("/signup");
    await expect(page.getByText("Create your account")).toBeVisible();

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("TestPass123!");
    await page.getByRole("button", { name: "Create Account" }).click();

    await page.waitForURL("**/onboarding", { timeout: 15000 });
    expect(page.url()).toContain("/onboarding");
  });

  test("sign up with duplicate email shows error", async ({ page }) => {
    // Create user via API first
    const email = uniqueEmail();
    const res = await page.request.post("/api/auth/signup", {
      data: { email, password: "TestPass123!" },
    });
    expect(res.status()).toBe(201);

    // Try to sign up again with same email via UI
    await page.goto("/signup");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("TestPass123!");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page.getByText("already exists")).toBeVisible({ timeout: 10000 });
  });

  test("sign up with short password shows validation error", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password").fill("short");
    await page.getByLabel("Password").blur();

    await expect(page.getByText("at least 8 characters")).toBeVisible();
  });

  test("login with valid credentials succeeds", async ({ page }) => {
    // Create user via API
    const email = uniqueEmail();
    await page.request.post("/api/auth/signup", {
      data: { email, password: "TestPass123!" },
    });

    await logIn(page, email, "TestPass123!");
    // Should be on homepage with authenticated state (Explore link visible)
    await expect(
      page.getByRole("link", { name: "Explore" }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("login with wrong password shows error", async ({ page }) => {
    const email = uniqueEmail();
    await page.request.post("/api/auth/signup", {
      data: { email, password: "TestPass123!" },
    });

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.locator(".text-destructive").first()).toBeVisible({ timeout: 10000 });
  });

  test("signup page has link to login and vice versa", async ({ page }) => {
    await page.goto("/signup");
    // The form footer has "Sign in" (exact case) link — use exact match to avoid nav duplicate
    await expect(page.getByRole("link", { name: "Sign in", exact: true })).toBeVisible();

    await page.goto("/login");
    await expect(page.getByRole("link", { name: "Sign up", exact: true })).toBeVisible();
  });
});
