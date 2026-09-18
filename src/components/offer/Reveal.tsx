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
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
