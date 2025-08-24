import * as React from "react";
import { cn } from "@/lib/cn";

type Size = "sm" | "md" | "lg";
const map: Record<Size, string> = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

export function Spinner({ className, size = "md" as Size }: { className?: string; size?: Size }) {
  return (
    <svg
      className={cn("animate-spin text-foreground", map[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" fill="currentColor" />
    </svg>
  );
}
