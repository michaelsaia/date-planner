"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/saved", label: "Saved" },
  { href: "/profile", label: "Profile" },
];

export default function DesktopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="hidden md:flex sticky top-0 z-40 h-14 items-center border-b border-border bg-card/80 backdrop-blur-sm px-6">
      <Link href="/" className="flex items-center gap-2 mr-8">
        <Logo size={24} />
        <span className="font-semibold text-foreground text-lg">
          Date Planner
        </span>
      </Link>

      {session?.user && (
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted hover:text-foreground hover:bg-card"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-3">
        {session?.user ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Sign Out
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
