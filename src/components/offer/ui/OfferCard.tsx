import type { ReactNode } from "react";

export default function OfferCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-6 ${className}`}>{children}</div>
  );
}
