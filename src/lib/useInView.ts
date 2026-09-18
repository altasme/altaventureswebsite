import { useEffect, useRef, useState } from "react";

// Fires once, true, the first time the observed element scrolls into view.
// Never re-hides on scroll away. Includes a scroll-listener fallback for a
// fast, non-animated jump (End key, scrollbar drag, an anchor jump) that
// can move the viewport past an element without IntersectionObserver ever
// compositing a frame where it intersected.
export function useInView<T extends HTMLElement>(threshold = 0.15): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setInView(true);
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);

    const handleScroll = () => {
      if (node.getBoundingClientRect().top < window.innerHeight) reveal();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return [ref, inView];
}
