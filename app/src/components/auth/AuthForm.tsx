"use client";

import { useState } from "react";
import Link from "next/link";

type AuthFormProps = {
  mode: "login" | "signup";
  onSubmit: (email: string, password: string) => Promise<void>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email is required";
  if (!EMAIL_RE.test(value)) return "Please enter a valid email address";
  return null;
}

function validatePassword(value: string, isLogin: boolean): string | null {
  if (!value) return "Password is required";
  if (!isLogin && value.length < 8) return "Password must be at least 8 characters";
  return null;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const isLogin = mode === "login";

  const emailError = touched.email ? validateEmail(email) : null;
  const passwordError = touched.password ? validatePassword(password, isLogin) : null;
  const hasFieldErrors = validateEmail(email) !== null || validatePassword(password, isLogin) !== null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Mark all fields as touched on submit attempt
    setTouched({ email: true, password: true });

    if (hasFieldErrors) return;

    setError("");
    setLoading(true);

    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          {isLogin ? "Sign in to plan your next date" : "Start planning creative date nights"}
        </p>
      </div>

      <div className="mx-auto mt-6 sm:mt-8 w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div role="alert" className="rounded-lg border border-destructive-border bg-destructive-light px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={emailError ? "true" : undefined}
              aria-describedby={emailError ? "email-error" : undefined}
              className={`mt-1.5 block w-full rounded-lg border bg-card px-3 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 ${
                emailError
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary focus:ring-primary"
              }`}
              placeholder="you@example.com"
              inputMode="email"
            />
            {emailError && (
              <p id="email-error" className="mt-1.5 text-sm text-destructive">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              aria-invalid={passwordError ? "true" : undefined}
              aria-describedby={passwordError ? "password-error" : undefined}
              className={`mt-1.5 block w-full rounded-lg border bg-card px-3 py-2.5 text-base sm:text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-1 ${
                passwordError
                  ? "border-destructive focus:border-destructive focus:ring-destructive"
                  : "border-border focus:border-primary focus:ring-primary"
              }`}
              placeholder={isLogin ? "Enter your password" : "At least 8 characters"}
            />
            {passwordError && (
              <p id="password-error" className="mt-1.5 text-sm text-destructive">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || (touched.email && touched.password && hasFieldErrors)}
            className="flex w-full justify-center rounded-full bg-primary px-4 py-3 sm:py-2.5 min-h-[44px] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={isLogin ? "/signup" : "/login"}
            className="font-medium text-primary hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
