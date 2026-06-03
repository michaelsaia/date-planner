import { type Page, expect } from "@playwright/test";

let userCounter = 0;

/** Generate a unique test email for each test run */
export function uniqueEmail(): string {
  userCounter++;
  return `e2e-${Date.now()}-${userCounter}@test.com`;
}

const TEST_PASSWORD = "TestPass123!";

/** Sign up a new user via the UI and return credentials */
export async function signUp(page: Page, email?: string) {
  const userEmail = email ?? uniqueEmail();
  await page.goto("/signup");
  await page.waitForLoadState("domcontentloaded");
  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Create Account" }).click();
  // After signup, user is redirected to /onboarding
  await page.waitForURL("**/onboarding", { timeout: 15000 });
  return { email: userEmail, password: TEST_PASSWORD };
}

/** Sign up via API (faster, for tests that don't test the signup UI) */
export async function signUpViaApi(page: Page, email?: string) {
  const userEmail = email ?? uniqueEmail();
  // Create account via API
  const res = await page.request.post("/api/auth/signup", {
    data: { email: userEmail, password: TEST_PASSWORD },
  });
  expect(res.status()).toBe(201);

  // Sign in via NextAuth credentials
  await page.goto("/login");
  await page.waitForLoadState("domcontentloaded");
  await page.getByLabel("Email").fill(userEmail);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).click();
  // Wait for redirect away from login
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15000 });

  return { email: userEmail, password: TEST_PASSWORD };
}

/** Complete the onboarding flow (interests → budget → location) */
export async function completeOnboarding(page: Page) {
  // Step 1: Interests
  await expect(page.getByText("What do you enjoy?")).toBeVisible({ timeout: 15000 });
  // Click interest pill buttons (inside flex-wrap containers, not navigation buttons)
  const interestPills = page.locator(".flex.flex-wrap button");
  const count = await interestPills.count();
  for (let i = 0; i < Math.min(3, count); i++) {
    await interestPills.nth(i).click();
  }
  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Next" }).click();

  // Step 2: Budget — defaults are fine, just advance
  await expect(page.getByRole("heading", { name: /budget/i })).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Next" }).click();

  // Step 3: Location — skip (optional), finish
  await expect(page.getByRole("heading", { name: /where are you based/i })).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: "Finish" }).click();

  // Should redirect to /explore
  await page.waitForURL("**/explore", { timeout: 15000 });
}

/** Sign up, onboard, and land on /explore. Fastest path for tests that need an authenticated, onboarded user. */
export async function signUpAndOnboard(page: Page) {
  const creds = await signUpViaApi(page);
  // After login, new user without profile goes to / or gets redirected to onboarding from /explore
  await page.goto("/onboarding");
  await completeOnboarding(page);
  return creds;
}

/** Log in an existing user */
export async function logIn(page: Page, email: string, password = TEST_PASSWORD) {
  await page.goto("/login");
  await page.waitForLoadState("domcontentloaded");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15000 });
}
