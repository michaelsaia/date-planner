import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a Date Planner account and start discovering creative date nights.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
