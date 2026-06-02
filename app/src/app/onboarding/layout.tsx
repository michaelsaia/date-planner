import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Up Your Profile",
  description: "Tell us about your interests, budget, and location to get personalized date ideas.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
