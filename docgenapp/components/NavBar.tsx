"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function NavBar() {
  const pathname = usePathname();

  let backHref: string | null = null;
  if (pathname && pathname.startsWith("/documenti/") && pathname !== "/documenti") {
    backHref = "/documenti";
  } else if (pathname && pathname !== "/") {
    backHref = "/";
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2">
          {backHref ? (
            <Link href={backHref} className="inline-flex">
              <Button variant="outline" size="sm">Indietro</Button>
            </Link>
          ) : null}
          <Link href="/" className="text-sm font-semibold tracking-wide">
            ContoTermico Docs
          </Link>
        </div>
        <nav className="flex items-center gap-2">
          <Link href="/documenti" className="inline-flex">
            <Button variant="ghost" size="sm">Documenti</Button>
          </Link>
          <Link href="/design" className="inline-flex">
            <Button variant="ghost" size="sm">Design</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
