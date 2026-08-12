import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "light" | "alt" | "dark";
}

const TONE_CLASSES: Record<NonNullable<SectionProps["tone"]>, string> = {
  light: "bg-paper text-ink",
  alt: "bg-paper-alt text-ink",
  dark: "bg-brand-navy-deep text-white",
};

export default function Section({ id, children, className = "", tone = "light" }: SectionProps) {
  return (
    <section id={id} className={TONE_CLASSES[tone]}>
      <div className={`mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:px-8 lg:py-28 ${className}`}>
        {children}
      </div>
    </section>
  );
}
