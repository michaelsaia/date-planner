import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="text-7xl sm:text-8xl">🗓️</div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base text-muted leading-relaxed">
        We couldn&apos;t find the page you&apos;re looking for. It may have been
        moved or doesn&apos;t exist.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/explore"
          className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-white transition-opacity hover:opacity-90"
        >
          Explore Date Ideas
        </Link>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-base font-medium text-foreground transition-colors hover:bg-card"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
