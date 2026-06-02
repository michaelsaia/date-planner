import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SuggestionsFeed from "@/components/explore/SuggestionsFeed";

export const metadata = {
  title: "Explore Date Ideas",
  description: "Browse personalized date night suggestions based on your interests and budget.",
};

export default async function ExplorePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has completed onboarding
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Explore Date Ideas</h1>
        <p className="mt-2 text-muted">
          Personalized suggestions based on your interests and budget.
        </p>
      </div>

      <SuggestionsFeed />
    </div>
  );
}
