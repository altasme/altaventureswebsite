import type { ReactNode } from "react";

interface OfferSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Alternates the dark background shade for visual rhythm between sections. */
  shade?: "deep" | "navy";
}

const SHADE_CLASSES: Record<NonNullable<OfferSectionProps["shade"]>, string> = {
  deep: "bg-brand-navy-deep",
  navy: "bg-brand-navy",
};

export default function OfferSection({ id, children, className = "", shade = "deep" }: OfferSectionProps) {
  return (
    <section id={id} className={`${SHADE_CLASSES[shade]} text-white`}>
      <div className={`mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8 lg:py-24 ${className}`}>{children}</div>
    </section>
  );
}
