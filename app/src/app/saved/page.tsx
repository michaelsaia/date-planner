import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import SavedDatesList from "@/components/saved/SavedDatesList";

export const metadata = {
  title: "Saved Dates",
  description: "Your bookmarked date ideas, ready when you are.",
};

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Redirect to onboarding if profile not set up
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Saved Dates</h1>
        <p className="mt-2 text-muted">
          Your bookmarked date ideas, ready when you are.
        </p>
      </div>

      <SavedDatesList />
    </div>
  );
}
