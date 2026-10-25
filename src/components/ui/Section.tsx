import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  // Applied to the outer <section> itself, not the inner content wrapper
  // -- for things like the .bg-grain texture (index.css) that need to
  // cover the section's full bleed width, not just the max-w-6xl content
  // column. Optional, additive, zero effect on every existing caller.
  sectionClassName?: string;
  tone?: "light" | "alt" | "dark" | "brand";
}

const TONE_CLASSES: Record<NonNullable<SectionProps["tone"]>, string> = {
  light: "bg-paper text-ink",
  alt: "bg-paper-alt text-ink",
  dark: "bg-brand-navy-deep text-white",
  brand: "bg-brand-blue text-white",
};

export default function Section({ id, children, className = "", sectionClassName = "", tone = "light" }: SectionProps) {
  return (
    <section id={id} className={`relative ${TONE_CLASSES[tone]} ${sectionClassName}`}>
      {/* relative z-10 guarantees real content always paints above a
          .bg-grain texture or DecorativeShapes layer an ancestor might
          carry, regardless of which section/variant calls this. */}
      <div className={`relative z-10 mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8 lg:py-28 ${className}`}>
        {children}
      </div>
    </section>
  );
}
