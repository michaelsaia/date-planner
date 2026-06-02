import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DateIdeaDetail from "@/components/explore/DateIdeaDetail";

export const metadata = {
  title: "Date Idea Details",
  description: "See the full plan with activities, venues, and a surprise.",
};

export default async function DateIdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    redirect("/onboarding");
  }

  const { id } = await params;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 pb-24 sm:py-8 sm:pb-8">
      <DateIdeaDetail id={id} />
    </div>
  );
}
