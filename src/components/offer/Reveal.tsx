import { useEffect, useState, type ReactNode } from "react";
import { useInView } from "../../lib/useInView";

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

// Fades and lifts content in once as it scrolls into view (useInView
// handles the IntersectionObserver + fast-scroll fallback). Respects
// prefers-reduced-motion by rendering fully visible immediately.
export default function Reveal({ children, delayMs = 0, className = "" }: RevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const visible = inView || reducedMotion;

  return (
    <div
      ref={ref}
      // [2026-10-25] Swapped the plain ease-out curve for a slower,
      // more deliberate "expo-out" cubic-bezier and a touch more lift
      // distance/duration -- the kind of confident, unhurried settle
      // premium sites use instead of a snappy default-ease fade, used
      // site-wide since this one component drives scroll-reveal on
      // every page that imports it.
      className={`transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
