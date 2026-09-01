import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

// Fades and lifts content in once as it scrolls into view. Triggers a
// single time (never re-hides on scroll away) and respects
// prefers-reduced-motion by rendering fully visible immediately.
export default function Reveal({ children, delayMs = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setVisible(true);
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);

    // Fallback for IntersectionObserver: a fast, non-animated jump scroll
    // (End key, scrollbar drag, a same-page anchor jump) can move the
    // viewport past an element without the browser ever compositing a
    // frame where it intersected, so the observer never fires and the
    // content stays invisible forever. A scroll listener with a direct
    // geometry check guarantees anything already scrolled to or past is
    // revealed regardless of how the scroll happened.
    const handleScroll = () => {
      if (node.getBoundingClientRect().top < window.innerHeight) reveal();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
