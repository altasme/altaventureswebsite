import { useEffect, useRef } from "react";
import { track } from "./analytics";

const THRESHOLDS = [25, 50, 75, 100] as const;

export function useScrollDepth() {
  const fired = useRef(new Set<(typeof THRESHOLDS)[number]>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const depthPct = (window.scrollY / scrollable) * 100;

      for (const threshold of THRESHOLDS) {
        if (depthPct >= threshold && !fired.current.has(threshold)) {
          fired.current.add(threshold);
          track("scroll_depth", { depth: threshold });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}
