"use client";

import { useSession } from "next-auth/react";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

/**
 * NavShell wraps page content with desktop header and mobile bottom nav.
 * On mobile, adds bottom padding only when the mobile nav is visible
 * (authenticated users) to prevent content from being hidden behind it.
 */
export default function NavShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const hasMobileNav = !!session?.user;

  return (
    <>
      <DesktopNav />
      <main
        className={`flex flex-1 flex-col ${hasMobileNav ? "pb-16 md:pb-0" : ""}`}
      >
        {children}
      </main>
      <MobileNav />
    </>
  );
}
