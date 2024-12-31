"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-semibold">
          Bank Bonus Tracker
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-primary">
            Tracker
          </Link>
          <Link href="/analytics" className="hover:text-primary">
            Analytics
          </Link>
        </div>
      </div>
      <ThemeToggle />
    </nav>
  );
}
