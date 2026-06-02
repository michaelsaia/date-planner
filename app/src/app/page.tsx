import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-4">
      <section className="flex flex-col items-center gap-8 text-center max-w-2xl py-24">
        <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Date Planner
        </h1>
        <p className="text-xl text-muted max-w-lg leading-relaxed">
          Discover creative, personalized date nights tailored to your interests, budget, and
          location. Break out of the routine together.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {session?.user ? (
            <>
              <Link
                href="/explore"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-white transition-opacity hover:opacity-90"
              >
                Explore Date Ideas
              </Link>
              <Link
                href="/profile"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-base font-medium text-foreground transition-colors hover:bg-card"
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-white transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-base font-medium text-foreground transition-colors hover:bg-card"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full">
          <FeatureCard
            title="Personalized"
            description="Get suggestions based on your shared interests and budget"
          />
          <FeatureCard
            title="Complete Plans"
            description="Each idea is a full date night with activities, venues, and surprises"
          />
          <FeatureCard
            title="Save Favorites"
            description="Bookmark the best ideas and plan them when you're ready"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}
