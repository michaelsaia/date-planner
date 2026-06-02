"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";

export default function SignUpPage() {
  const router = useRouter();

  async function handleSignUp(email: string, password: string) {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create account");
    }

    // Auto sign-in after successful registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Account created but sign-in failed. Please try logging in.");
    }

    router.push("/onboarding");
    router.refresh();
  }

  return <AuthForm mode="signup" onSubmit={handleSignUp} />;
}
